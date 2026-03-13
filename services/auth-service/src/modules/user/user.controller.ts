import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginUserInput, UpdateEmailInput, UpdatePassInput } from "./user.schema";
import bcrypt from "bcrypt";
import fetch, { RequestInit } from "node-fetch";
import prisma from "../../utils/prisma";
import { getHttpsAgent } from "../../utils/https-agent";

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function getAuthCookieOptions(maxAge?: number) {
  const isProduction = process.env.NODE_ENV === "production";
  const secureCookie = process.env.USE_HTTPS === "true" || isProduction;
  const sameSite: "lax" | "none" = "lax";

  return {
    path: "/",
    httpOnly: true,
    secure: secureCookie,
    sameSite,
    ...(typeof maxAge === "number" ? { maxAge } : {}),
  };
}

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

    try {
      const chatServiceUrl = process.env.CHAT_SERVICE_URL || "https://chat-service:3700";
      const httpsAgent = getHttpsAgent();
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
        },
        body: JSON.stringify({
          id: user.id,
          username: user.name,
        }),
      };

      if (httpsAgent) {
        (fetchOptions as any).agent = httpsAgent;
      }

      const chatServiceResponse = await fetch(`${chatServiceUrl}/users/add`, fetchOptions);

      if (!chatServiceResponse.ok) {
        console.error("Failed to sync user with chat service:", await chatServiceResponse.text());
      }
    } catch (syncError) {
      console.error("Error syncing user with chat service:", syncError);
    }

    return reply.code(201).send(user);
  } catch (e) {
    return reply.code(500).send({message: "User Already Exists"});
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
  
  const accessToken = req.jwt.sign(payload, { expiresIn: "15m" });
  
  const refreshToken = req.jwt.sign(payload, { expiresIn: "7d" });

  await prisma.user.update({
    where: { email },
    data: { loggedIn: true, refreshToken },
  });

  reply.setCookie("refresh_token", refreshToken, {
    ...getAuthCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS),
  });
  
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
  
    reply.setCookie("refresh_token", refreshToken, {
      ...getAuthCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS),
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
      data: {
        password: hashedPassword,
        refreshToken: null,
        loggedIn: false,
      },
    });

    reply.clearCookie("refresh_token", {
      ...getAuthCookieOptions(),
    });

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

    reply.setCookie("refresh_token", refreshToken, {
      ...getAuthCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS),
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
    ...getAuthCookieOptions(),
  });

  return reply.send({ message: "Logout successful" });
}

export async function refreshToken(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = req.cookies.refresh_token;


  if (!refreshToken) {
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
      reply.clearCookie("refresh_token", {
        ...getAuthCookieOptions(),
      });
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

    reply.setCookie("refresh_token", newRefreshToken, {
      ...getAuthCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS),
    });

    const responseData = { 
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };


    return reply.send(responseData);
  } catch (err) {
    reply.clearCookie("refresh_token", {
      ...getAuthCookieOptions(),
    });
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