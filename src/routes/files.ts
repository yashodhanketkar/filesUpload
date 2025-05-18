import { Router } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { addFileJob } from "../queue/producer";

const upload = multer({
  dest: "./uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
});
const router = Router();
const prisma = new PrismaClient();

router.post("/", upload.single("file"), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const record = await prisma.file.create({
    data: {
      userId: (req as any).user.userId,
      originalFilename: file.originalname,
      storagePath: file.path,
      title,
      description,
      status: "uploaded",
    },
  });

  await addFileJob(record.id);

  res.json({ fileId: record.id, status: record.status });
});

router.get("/:id", async (req, res) => {
  const file = await prisma.file.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!file || file.userId !== (req as any).user.userId)
    return res.sendStatus(403);
  res.json(file);
});

export { router as fileRouter };
