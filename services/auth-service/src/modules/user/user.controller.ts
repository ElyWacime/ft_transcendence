import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginUserInput, UpdateEmailInput, UpdatePassInput } from "./user.schema";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";

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
      message: "User already exists with this email",
    });
  }
  const name_user = await prisma.user.findUnique({
    where: {
      name: name,
    },
  });
  if (name_user) {
    return reply.code(401).send({
      message: "User already exists with this name",
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
  await prisma.user.update({
    where: { email },
    data: { loggedIn: true },
  });

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  
  const token = req.jwt.sign(payload);

  const replay = reply.setCookie("access_token", token, {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  console.log("\n\n\nreply from cookies: ", replay);
  console.log("\n\n\naccess_token cookie set", token);
  return { accessToken: token };
}

export async function update_email(
  req: FastifyRequest<{
    Body: UpdateEmailInput;
  }>,
  reply: FastifyReply,
) {
  const { new_email, password } = req.body;

  const cookieToken = req.cookies.access_token;

  try {
    const decoded = req.jwt.verify(cookieToken);
    const decoded_email = decoded.email;
    const user = await prisma.user.findUnique({ 
      where: { email: decoded_email } 
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
      where: { email: decoded_email },
      data: { email: new_email },
    });
  
    const token = req.jwt.sign({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    });
  
    reply.setCookie("access_token", token, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  
    return {
      success: true,
      message: "Email updated successfully",
      accessToken: token,
    };
     
  } catch (error) {
    console.error(error);
    return reply.code(401).send({ 
      message: error,
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
  req: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply,
) {
  const { email } = req.body;
  const user = await prisma.user.update({
    where: { email },
    data: { loggedIn: false },
  });
  reply.clearCookie("access_token");
  return reply.send({ message: "Logout successful" });
}


interface UpdateImageBody {
  image: string; // base64 string
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
    
    console.log(`[update_image] Updated avatar for user ${userId}, MIME type: ${mimeType}`);
    
    return reply.send({
      success: true,
      message: "Image updated successfully",
      avatar_url: avatarUrl,
      user: updatedUser
    });
    
  } catch (err) {
    console.error('[update_image] Error:', err);

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