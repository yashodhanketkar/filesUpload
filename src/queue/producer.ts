import { fileQueue } from "./init";

export const addFileJob = async (fileId: number) => {
  await fileQueue.add("processFile", { fileId });
};
