import readline from "node:readline/promises";
import { addPdfFolder, addPdf, retrieveForImage } from "./index.js";
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
    parameters: `<imagePath> (<numberOfResults> = ${C.retrieval.defaultNResults})`,
    action: async (args) => {
      const [imagePath, nResults] = args;
      await retrieveForImage(
        imagePath,
        nResults ? parseInt(nResults) : undefined
      );
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

function parseInput(input) {
  const regex = /"([^"]+)"|(\S+)/g;
  const tokens = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    tokens.push(match[1] || match[2]);
  }
  return tokens;
}

async function handleCommand(input) {
  if (input.trim() === "exit") {
    return true;
  }

  const tokens = parseInput(input.trim());
  const cmd = tokens[0];
  const args = tokens.slice(1);
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
    if (command.maxArgs === 1) {
      await command.action(args[0]);
    } else {
      await command.action(args);
    }
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
  });

  async function startCLI() {
    try {
      console.info("Welcome to Semantic Image Search CLI!\n");
      printHelp();

      while (true) {
        const input = await rl.question("> ");
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
