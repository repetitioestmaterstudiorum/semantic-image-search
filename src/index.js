import { createLogger } from "./logger.js";
import { createCLI } from "./cli.js";
import { embedImage } from "./embed.js";

const log = createLogger();
log.info("Initializing");

const DEFAULT_N_RESULTS = 5;

export function addPdfFolder(folderPath) {
  log.info(`Adding folder "${folderPath}"`);
}

export function addPdf(pdfPath) {
  log.info(`Adding PDF "${pdfPath}"`);
}

export function retrieveForPdf(pdfPath, nResults = DEFAULT_N_RESULTS) {
  log.info(`Retrieving ${nResults} most similar PDFs for PDF "${pdfPath}"`);
}

export async function embedTest() {
  log.info("Embedding test");
  const embedding = await embedImage(
    "dataset/pdf-png/3274T79_Steel Oval Eye Nut- for Lifting.png"
  );
  log.info("Embedding", embedding);
}

const cli = createCLI();
cli.startCLI();
