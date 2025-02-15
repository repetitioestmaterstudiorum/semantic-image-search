import { createLogger } from "./logger.js";
import { createCLI } from "./cli.js";
import { embedImageFromPath } from "./embed.js";
import { C } from "./constants.js";
import "./db.js";
import { join } from "path";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { pdfToImageStreams } from "./pdf.js";
import { findSimilar, insertOne } from "./db.js";

const log = createLogger();
log.info("Initializing");

export async function addPdfFolder(folderPath) {
  log.info(`Adding folder "${folderPath}"`);
  let entries;
  try {
    entries = await fs.readdir(folderPath, { withFileTypes: true });
  } catch (err) {
    log.error(`Error reading folder "${folderPath}": ${err}`);
    return;
  }
  const pdfFiles = entries.filter(
    (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")
  );

  // Process PDFs in batches
  for (let i = 0; i < pdfFiles.length; i += C.embedding.batchSize) {
    const batch = pdfFiles.slice(i, i + C.embedding.batchSize);
    log.info(
      `Processing PDF batch ${i / C.embedding.batchSize + 1} of ${Math.ceil(
        pdfFiles.length / C.embedding.batchSize
      )}`
    );

    await Promise.all(
      batch.map((file) => {
        const pdfPath = join(folderPath, file.name);
        return addPdf(pdfPath);
      })
    );
  }
}

export async function addPdf(pdfPath) {
  try {
    // Create working directory if it doesn't exist
    try {
      await fs.access(C.pdfToPng.workingDirectory);
    } catch {
      await fs.mkdir(C.pdfToPng.workingDirectory);
    }

    const pageStreams = await pdfToImageStreams(pdfPath);
    const tempFiles = [];

    for (const { pageNumber, stream } of pageStreams) {
      // Save stream to temporary PNG file
      const tempImagePath = join(
        C.pdfToPng.workingDirectory,
        `${pdfPath.split("/").pop()}-page${pageNumber}.png`
      );
      tempFiles.push(tempImagePath);
      const writeStream = createWriteStream(tempImagePath);
      await pipeline(stream, writeStream);

      const embedding = await embedImageFromPath(tempImagePath);
      log.info(`Embedding length: ${embedding.length}`);
      await insertOne({
        vector: embedding,
        fileName: pdfPath.split("/").pop(),
        pageNumber,
      });
      log.info(`Inserted embedding for PDF "${pdfPath}", page ${pageNumber}`);
    }

    // Clean up temporary files
    await Promise.all(tempFiles.map((file) => fs.unlink(file)));
  } catch (err) {
    log.error(`Error adding PDF "${pdfPath}": ${err}`);
  }
}

export async function retrieveForImage(
  imagePath,
  nResults = C.retrieval.defaultNResults
) {
  log.info(`Retrieving ${nResults} most similar PDFs for image "${imagePath}"`);
  try {
    const embedding = await embedImageFromPath(imagePath);
    log.info(`Embedding length: ${embedding.length}`);
    const results = await findSimilar({ vector: embedding, nResults });
    log.info("Retrieval results:", results);
    return results;
  } catch (err) {
    log.error(`Error retrieving for image "${imagePath}": ${err}`);
    return [];
  }
}

const cli = createCLI();
cli.startCLI();
