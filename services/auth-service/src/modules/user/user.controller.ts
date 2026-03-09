import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginUserInput, UpdateEmailInput, UpdatePassInput } from "./user.schema";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { getHttpsAgent } from "../../utils/https-agent";

const SALT_ROUNDS = 10;

export async function createUser(
  req: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply,
) {
  const { password, email, name } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    return reply.code(401).send({
      message: "User already exists",
    });
  }
  const name_user = await prisma.user.findUnique({
    where: {
      name: name,
    },
  });
  if (name_user) {
    return reply.code(401).send({
      message: "User already exists",
    });
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        password: hash,
        email,
        name,
      },
    });
    return reply.code(201).send(user);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

export async function login(
  req: FastifyRequest<{
    Body: LoginUserInput;
  }>,
  reply: FastifyReply,
) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email } });
  const isMatch = user && (await bcrypt.compare(password, user.password));
  if (!user || !isMatch) {
    return reply.code(401).send({
      message: "Invalid email or password",
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  
  // Short-lived access token (15 minutes)
  const accessToken = req.jwt.sign(payload, { expiresIn: "15m" });
  
  // Long-lived refresh token (7 days)
  const refreshToken = req.jwt.sign(payload, { expiresIn: "7d" });

  await prisma.user.update({
    where: { email },
    data: { loggedIn: true, refreshToken },
  });

  const isProduction = process.env.NODE_ENV === "production";
  const secureCookie = process.env.USE_HTTPS === "true" || isProduction;
  
  console.log("[LOGIN] Setting refresh_token cookie with sameSite:", secureCookie ? "none" : "lax");
  
  // Store refresh token in httpOnly cookie (XSS protection)
  reply.setCookie("refresh_token", refreshToken, {
    path: "/",
    httpOnly: true,
    secure: secureCookie,
    sameSite: secureCookie ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
  
  console.log("[LOGIN] Login successful, returning access token and user");
  
  // Return access token in response body (to be stored in memory on frontend)
  // Also return user info for immediate use
  return { 
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  };
}

export async function update_email(
  req: FastifyRequest<{
    Body: UpdateEmailInput;
  }>,
  reply: FastifyReply,
) {
  const { new_email, password } = req.body;

  let token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return reply.code(401).send({ message: "Authentication required" });
  }

  try {
    const decoded = req.jwt.verify(token) as { id: string; email: string; name: string };
    const user = await prisma.user.findUnique({ 
      where: { email: decoded.email } 
    });
    
    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.code(401).send({ message: "Invalid password" });
    }
  
    const emailExists = await prisma.user.findUnique({
      where: { email: new_email }
    });
    
    if (emailExists) {
      return reply.code(409).send({ message: "Email already in use" });
    }
  
    const updatedUser = await prisma.user.update({
      where: { email: decoded.email },
      data: { email: new_email },
    });
  
    try {
      const gameServiceUrl = process.env.GAME_SERVICE_URL || 'https://game-server:3000';
      const httpsAgent = getHttpsAgent();
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: updatedUser.id,
          email: new_email,
        }),
      };
      if (httpsAgent) {
        (fetchOptions as any).agent = httpsAgent;
      }
      const gameServiceResponse = await fetch(`${gameServiceUrl}/sync-email`, fetchOptions);

      if (!gameServiceResponse.ok) {
        console.error('Failed to sync email with game service:', await gameServiceResponse.text());
      }
    } catch (syncError) {
      console.error('Error syncing email with game service:', syncError);
    }

    const payload = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    };

    const accessToken = req.jwt.sign(payload, { expiresIn: "15m" });
    const refreshToken = req.jwt.sign(payload, { expiresIn: "7d" });

    await prisma.user.update({
      where: { id: updatedUser.id },
      data: { refreshToken },
    });
  
    const isProduction = process.env.NODE_ENV === "production";
    const secureCookie = process.env.USE_HTTPS === "true" || isProduction;

    reply.setCookie("refresh_token", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: secureCookie,
      sameSite: secureCookie ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60,
    });
  
    return {
      success: true,
      message: "Email updated successfully",
      accessToken,
      newEmail: updatedUser.email,
    };
     
  } catch (error) {
    return reply.code(401).send({ 
      message: "Unauthorized",
    });
  }
}

export async function update_password(
  req: FastifyRequest<{
    Body: UpdatePassInput;
  }>,
  reply: FastifyReply,
) {
  try {
    const userToken = req.user as {
      id: string;
      email: string;
    };

    const { current_password, new_password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: userToken.email },
    });

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      current_password,
      user.password,
    );

    if (!isPasswordValid) {
      return reply.code(401).send({ message: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await prisma.user.update({
      where: { email: userToken.email },
      data: { password: hashedPassword },
    });

    reply.clearCookie("access_token");

    return reply.send({
      success: true,
      message: "Password updated successfully. Please log in again.",
    });
  } catch (err) {
    console.error(err);
    return reply.code(500).send({
      message: "Internal server error",
    });
  }
}

export async function update_username(
  req: FastifyRequest<{
    Body: { current_password: string; new_username: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const userToken = req.user as {
      id: string;
      email: string;
    };

    const { current_password, new_username } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: userToken.email },
    });

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      current_password,
      user.password,
    );

    if (!isPasswordValid) {
      return reply.code(401).send({ message: "Invalid password" });
    }

    const usernameExists = await prisma.user.findUnique({
      where: { name: new_username },
    });

    if (usernameExists) {
      return reply.code(409).send({ message: "Username already taken" });
    }

    const updatedUser = await prisma.user.update({
      where: { email: userToken.email },
      data: { name: new_username },
    });

    try {
      const chatServiceUrl = process.env.CHAT_SERVICE_URL || 'https://chat-service:3700';
      const httpsAgent = getHttpsAgent();
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: updatedUser.id,
          username: new_username,
        }),
      };
      if (httpsAgent) {
        (fetchOptions as any).agent = httpsAgent;
      }
      const chatServiceResponse = await fetch(`${chatServiceUrl}/user/update`, fetchOptions);

      if (!chatServiceResponse.ok) {
        console.error('Failed to sync username with chat service:', await chatServiceResponse.text());
      }
    } catch (syncError) {
      console.error('Error syncing username with chat service:', syncError);
    }

    const payload = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    };

    const accessToken = req.jwt.sign(payload, { expiresIn: "15m" });
    const refreshToken = req.jwt.sign(payload, { expiresIn: "7d" });

    await prisma.user.update({
      where: { id: updatedUser.id },
      data: { refreshToken },
    });

    const isProduction = process.env.NODE_ENV === "production";
    const secureCookie = process.env.USE_HTTPS === "true" || isProduction;

    reply.setCookie("refresh_token", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: secureCookie,
      sameSite: secureCookie ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send({
      success: true,
      message: "Username updated successfully",
      accessToken,
      newUsername: updatedUser.name,
    });
  } catch (err) {
    console.error(err);
    return reply.code(500).send({
      message: "Internal server error",
    });
  }
}

export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      id: true,
      email: true,
    },
  });
  return reply.code(200).send(users);
}

export async function logout(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const userToken = req.user as {
    id: string;
    email: string;
  };

  await prisma.user.update({
    where: { id: userToken.id },
    data: { loggedIn: false, refreshToken: null },
  });

  reply.clearCookie("refresh_token", {
    path: "/",
  });

  return reply.send({ message: "Logout successful" });
}

export async function refreshToken(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = req.cookies.refresh_token;

  console.log("[REFRESH] Cookies received:", Object.keys(req.cookies));
  console.log("[REFRESH] refresh_token present:", !!refreshToken);

  if (!refreshToken) {
    console.log("[REFRESH] No refresh token in cookies - returning 401");
    return reply.code(401).send({ message: "Refresh token required" });
  }

  try {
    const decoded = req.jwt.verify(refreshToken) as {
      id: string;
      email: string;
      name: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      reply.clearCookie("refresh_token");
      return reply.code(401).send({ message: "Invalid refresh token" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const newAccessToken = req.jwt.sign(payload, { expiresIn: "15m" });
    
    await new Promise(resolve => setTimeout(resolve, 1));
    const newRefreshToken = req.jwt.sign(payload, { expiresIn: "7d" });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    const isProduction = process.env.NODE_ENV === "production";
    const secureCookie = process.env.USE_HTTPS === "true" || isProduction;

    console.log("[REFRESH] Setting new refresh_token cookie with sameSite:", secureCookie ? "none" : "lax");

    reply.setCookie("refresh_token", newRefreshToken, {
      path: "/",
      httpOnly: true,
      secure: secureCookie,
      sameSite: secureCookie ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    const responseData = { 
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };

    console.log("[REFRESH] Returning response:", JSON.stringify(responseData));

    return reply.send(responseData);
  } catch (err) {
    reply.clearCookie("refresh_token");
    return reply.code(401).send({ message: "Invalid or expired refresh token" });
  }
}


interface UpdateImageBody {
  image: string;
  image_name: string;
  file_type?: string;
  file_size?: number;
}

export const update_image = async (
  req: FastifyRequest<{ Body: UpdateImageBody }>,
  reply: FastifyReply
) => {
  const { image, image_name, file_type } = req.body;
  
  try {
    const userId = (req.user as any)?.id;
    
    if (!userId) {
      return reply.status(401).send({ 
        success: false, 
        message: "Unauthorized" 
      });
    }
    
    const imageBuffer = Buffer.from(image, 'base64');
    
    let mimeType = 'image/png';
    if (file_type) {
      mimeType = file_type;
    } else if (image_name) {
      const ext = image_name.toLowerCase().split('.').pop();
      const mimeMap: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp'
      };
      mimeType = mimeMap[ext || 'png'] || 'image/png';
    }
    
    const avatarUrl = `data:${mimeType};base64,${image}`;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        image: imageBuffer,
        image_name: image_name,
        avatar: avatarUrl
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true
      }
    });
    
    return reply.send({
      success: true,
      message: "Image updated successfully",
      avatar_url: avatarUrl,
      user: updatedUser
    });
    
  } catch (err) {


    if (err.code === 'P2025') {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }
    
    return reply.status(500).send({
      success: false,
      message: "Failed to update image"
    });
  }
};