import { PrismaClient } from "@prisma/client";
import { Queue, Worker } from "bullmq";
import fs from "fs/promises";
import crypto from "crypto";
import Redis from "ioredis";

const connection = new Redis();
export const fileQueue = new Queue("fileProcessing", { connection });
const prisma = new PrismaClient();

export const QueueInit = () => {
  new Worker(
    "fileProcessing",
    async (job) => {
      const file = await prisma.file.findUnique({
        where: { id: job.data.fileId },
      });
      if (!file) return;
      try {
        await prisma.file.update({
          where: { id: file.id },
          data: { status: "processing" },
        });
        const data = await fs.readFile(file.storagePath);
        const hash = crypto.createHash("sha256").update(data).digest("hex");
        await prisma.file.update({
          where: { id: file.id },
          data: { status: "processed", extractedData: `SHA256: ${hash}` },
        });
      } catch (err) {
        await prisma.file.update({
          where: { id: file.id },
          data: { status: "failed", extractedData: String(err) },
        });
      }
    },
    { connection },
  );
};
