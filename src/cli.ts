import { cac } from "cac";
import { generate } from "./main";
import * as pkgInfo from "../package.json";

const cli = cac("enigma-virtualbox");

// global options
interface GlobalCLIOptions {
  "--"?: string[];
  input?: string;
  output?: string;
  projectName?: string;
  exclude?: string;
}

cli
  .command("generate <entry>", 'Generate an "Enigma Virtual Box" project file.')
  .option(
    "--input <input>",
    "The input executable file path. Enigma packs the files from path2Pack into a copy of this executable.",
  )
  .option(
    "--output <output>",
    "The output executable file path. Enigma saves the packed file to this path.",
  )
  .option(
    "--project-name <projectName>",
    "The file name to which we want to save the generated evb file.",
    { default: "project.evb" },
  )
  .option("--exclude <exclude>", "Regular expression. Files to exclude.")
  .action(async (entry: string, options: GlobalCLIOptions) => {
    console.debug(entry, options);

    try {
      const shasumContent = await generate();
      console.warn(shasumContent);
      console.log("Generated successfully");
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

cli.help();
cli.version(pkgInfo.version);

cli.parse();
