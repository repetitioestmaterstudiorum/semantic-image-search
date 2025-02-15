import { exec } from "child_process";
import path from "path";
import { createLogger } from "./logger.js";

const log = createLogger();

export function embedImageFromPath(imagePath) {
  log.info(`Embedding image from path "${imagePath}"`);
  const absolutePath = path.resolve(imagePath);

  // This is very inefficient, but allows for batch processing. This runs the Python script many times in parallel!
  // In a non-PoC scenario, we would just make an async HTTP API for the Python script, e.g. with FastAPI.
  return new Promise((resolve, reject) => {
    const proc = exec(
      `PYTHON_DEBUG=1 pdm run embed.py "${absolutePath}"`,
      {
        encoding: "utf-8",
        cwd: "src/python_clip",
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        const lastLine = stdout.trim().split("\n").pop();
        resolve(JSON.parse(lastLine));
      }
    );

    // Pipe stderr to process.stderr to see Python logs
    proc.stderr.pipe(process.stderr);
  });
}
