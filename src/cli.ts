import { existsSync, statSync } from "node:fs";
import { cac } from "cac";
import { generate } from "./main";
import { GlobalCLIOptions } from "./types";
import * as pkgInfo from "../package.json";

const cli = cac("enigma-virtualbox");

cli
  .command("generate <entry>", 'Generate an "Enigma Virtual Box" project file.')
  .option(
    "-i, --input <input>",
    "The input executable file path. Enigma packs the files from path2Pack into a copy of this executable.",
  )
  .option(
    "-o, --output <output>",
    "The output executable file path. Enigma saves the packed file to this path.",
  )
  .option(
    "-p, --project-name <projectName>",
    "The file name to which we want to save the generated evb file.",
    { default: "project.evb" },
  )
  .option("--templatePath <templatePath>", "Set template path.")
  .example("--templatePath.project xxx")
  .option("--evbOptions <evbOptions>", "Set options for evb.")
  .example("--evbOptions.compressFiles xxx")
  .option("-e, --exclude <exclude>", "Regular expression. Files to exclude.")
  .action(async (entry: string, options: GlobalCLIOptions) => {
    console.debug(entry, options);
    const input = options.input || options.i;
    const output = options.output || options.o;
    const projectName = options.projectName || options.p;

    if (!input) {
      console.error("The parameter `--input` or `-i` cannot be empty.");
      process.exit(1);
    }

    if (!existsSync(input)) {
      console.error("The parameter `--input` or `-i` does not exist.");
      process.exit(1);
    }

    const stats = statSync(input);
    if (!stats.isFile()) {
      console.error("The parameter `--input` or `-i` not be a file.");
      process.exit(1);
    }

    if (!output) {
      console.error("The parameter `--output` or `-o` cannot be empty.");
      process.exit(1);
    }

    if (!projectName) {
      console.error("The parameter `--project-name` or `-p` cannot be empty.");
      process.exit(1);
    }

    try {
      const outputPath = await generate(entry, options);
      console.log("Generated successfully, outputPath: ", outputPath);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

cli.help();
cli.version(pkgInfo.version);

cli.parse();
