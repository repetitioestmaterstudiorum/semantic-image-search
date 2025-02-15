import { pdfToPng } from "pdf-to-png-converter";
import { Readable } from "stream";
import { createLogger } from "./logger.js";

const log = createLogger();

/**
 * Converts a PDF file into an array of image streams (one per page).
 * @param {string} pdfPath
 * @returns {Promise<Array<{ pageNumber: number, stream: import("stream").Readable }>>}
 */
export async function pdfToImageStreams(pdfPath) {
  try {
    const pngPages = await pdfToPng(pdfPath, {
      outputType: "png",
    });
    return pngPages.map((page, index) => ({
      pageNumber: index + 1,
      stream: Readable.from(page.content),
    }));
  } catch (err) {
    log.error("Error in pdfToImageStreams:", err);
    throw err;
  }
}
