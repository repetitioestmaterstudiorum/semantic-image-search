import { execSync } from "child_process";
import path from "path";
import { createLogger } from "./logger.js";

const log = createLogger();

export function embedImage(imagePath) {
  log.info(`Embedding image "${imagePath}"`);

  const absoluteImagePath = path.resolve(imagePath);
  try {
    const stdout = execSync(`pdm run embed.py "${absoluteImagePath}"`, {
      encoding: "utf-8",
      cwd: "src/python_clip",
    });
    // Get the last line which contains the JSON embedding
    const lastLine = stdout.trim().split("\n").pop();
    return JSON.parse(lastLine);
  } catch (error) {
    throw error;
  }
}
