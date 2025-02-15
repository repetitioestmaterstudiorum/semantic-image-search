import { execSync } from "child_process";
import path from "path";
import { createLogger } from "./logger.js";

const log = createLogger();

export function embedImageFromPath(imagePath) {
  log.info(`Embedding image from path "${imagePath}"`);
  const absolutePath = path.resolve(imagePath);
  try {
    const stdout = execSync(`pdm run embed.py "${absolutePath}"`, {
      encoding: "utf-8",
      cwd: "src/python_clip",
    });
    const lastLine = stdout.trim().split("\n").pop();
    return JSON.parse(lastLine);
  } catch (error) {
    throw error;
  }
}
