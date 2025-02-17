import { createLogger } from "./logger.js";
import path from "path";
import { C } from "./constants.js";

const log = createLogger();

export async function embedImageFromPath(imagePath) {
  log.info(`Embedding image from path "${imagePath}"`);
  const absolutePath = path.resolve(imagePath);

  try {
    const response = await fetch(`${C.pythonApi.url}/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_path: absolutePath }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Server error: ${error}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    log.error(`Error embedding image: ${error}`);
    throw error;
  }
}
