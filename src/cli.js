import readline from "node:readline/promises";
import { addPdfFolder, addPdf, retrieveForPdf } from "./index.js";
import { createLogger } from "./logger.js";
import { C } from "./constants.js";
import { dropTable } from "./db.js";

const log = createLogger();

const commands = {
  "add-folder": {
    parameters: "<folderPath>",
    action: addPdfFolder,
    minArgs: 1,
    maxArgs: 1,
  },
  "add-pdf": {
    parameters: "<pdfPath>",
    action: addPdf,
    minArgs: 1,
    maxArgs: 1,
  },
  retrieve: {
    parameters: `<pdfPath> (<numberOfResults> = ${C.retrieval.defaultNResults})`,
    action: (args) => {
      const [pdfPath, nResults] = args.split(" ");
      retrieveForPdf(pdfPath, parseInt(nResults));
    },
    minArgs: 1,
    maxArgs: 2,
  },
  "reset-db": {
    parameters: "",
    action: dropTable,
    minArgs: 0,
    maxArgs: 0,
  },
  help: {
    parameters: "",
    action: printHelp,
    minArgs: 0,
    maxArgs: 0,
  },
};

function printHelp() {
  console.info("Available commands:");
  for (const [cmd, info] of Object.entries(commands)) {
    console.info(`  ${cmd} ${info.parameters}`);
  }
  console.info('\nType a command or "exit" to quit\n');
}

async function handleCommand(input) {
  if (input.trim() === "exit") {
    return true;
  }

  const [cmd, ...args] = input.trim().split(" ");
  const command = commands[cmd];

  if (
    !command ||
    args.length < command.minArgs ||
    args.length > command.maxArgs
  ) {
    console.info(`Invalid command. ${command?.parameters}\n`);
    return false;
  }

  try {
    console.info("");
    await command.action(args.join(" "));
  } catch (error) {
    log.error("Error executing command:", error);
  }
  return false;
}

export function createCLI() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
    prompt: "> ",
  });

  async function startCLI() {
    try {
      console.info("Welcome to Semantic Image Search CLI!\n");
      printHelp();

      while (true) {
        const input = await rl.question("> ", { history: true });
        const shouldExit = await handleCommand(input);
        if (shouldExit) {
          rl.close();
          break;
        }
      }
    } catch (error) {
      log.error("CLI Error:", error);
      rl.close();
    }
  }

  return { startCLI };
}
