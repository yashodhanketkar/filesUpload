import express from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";
import { authRouter, fileRouter } from "./routes";
import { authMiddleware } from "./middleware";

config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRouter);
app.use("/upload", authMiddleware, fileRouter);
app.use("/files", authMiddleware, fileRouter);

app.listen(PORT, () => {
  return console.log(`Server is running on port ${PORT}`);
});
