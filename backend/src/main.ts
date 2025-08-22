
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./db"; 

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "MY_TEST_SECRET";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

app.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body as {
    username: string;
    email: string;
    password: string;
  };

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
    );
    stmt.run(username, email, hashedPassword);

    return res.status(201).json({ message: "User created" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as User | undefined;

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: "Wrong password" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ token });
});

// --- SERVER START ---
app.listen(3000, () => {
  console.log("Auth backend running on http://localhost:3000");
});

