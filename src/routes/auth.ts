import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password)
    return res.status(402).json({ message: "Invalid credentials" });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) return res.status(400).json({ message: "User already exists" });

  await prisma.user.create({ data: { email, password } });

  res.json({ message: "User created successfully" });
});

export { router as authRouter };
