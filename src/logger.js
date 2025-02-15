import debug from "debug";

export function createLogger() {
  const err = new Error();
  if (Error.captureStackTrace) Error.captureStackTrace(err, createLogger);
  const callerFilePath = extractFilePathAndLineInfo(err.stack);
  const levels = ["debug", "info", "warn", "error"];
  const logger = {};
  levels.forEach((level) => {
    const instance = debug(callerFilePath);
    logger[level] = (message, data) => {
      const timestamp = new Date().toISOString();
      const logMsg = `${timestamp} ${level.toUpperCase()}: ${message}`;
      data !== undefined ? instance(logMsg, data) : instance(logMsg);
    };
  });
  return logger;
}

function extractFilePathAndLineInfo(stack) {
  if (!stack) return "unknown";
  const lines = stack.split("\n");
  // pick the first stack line (after Error:)
  const line = lines[1] || "";
  const lineWithoutPath = line
    .replace("at file://", "")
    .replace(process.cwd(), "")
    .trim()
    .split(":")[0];
  return lineWithoutPath;
}
