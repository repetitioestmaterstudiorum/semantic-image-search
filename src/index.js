import { embedImage } from "./embed.js";
import { createLogger } from "./logger.js";

const log = createLogger();

log.info("Initializing");

const embedding = await embedImage(
  "dataset/pdf-png/3274T79_Steel Oval Eye Nut- for Lifting.png"
);
log.info("Embedding", embedding);
