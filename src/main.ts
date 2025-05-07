import { resolve, join } from "node:path";
import { readFileSync, writeFileSync, readdirSync, lstatSync } from "node:fs";
import Handlebars from "handlebars";
import { minimatch } from "minimatch";
import { merge } from "lodash-es";
import { DEFAULT_TEMPLATE, DEFAULT_TEMPLATE_PATH } from "./templates";
import { PRE_TAG_INDENTS, VARS, CHARS } from "./consts";
import { Dir } from "./objects";
import type { GlobalCLIOptions } from "./types";

// Take a template path, read/load it's content and return it. If we fail to load the file, we will throw an appropriate
// error.
// Note: The template file should be encoded in UCS2/UTF16LE (that's the encoding that Enigma Virtual Box expects)
const loadTemplateByPath = (templatePath: string): string => {
  return readFileSync(resolve(templatePath), "utf8");
};

// We remove indents to trim down template size (you can always beautify/prettify the end result if you wish)
const replaceTemplate = (template: string): string => {
  return template
    .replace(PRE_TAG_INDENTS, "<")
    .replace(RegExp(CHARS.LT.origin, "mg"), CHARS.LT.replaced)
    .replace(RegExp(CHARS.GT.origin, "mg"), CHARS.GT.replaced)
    .replace(RegExp(CHARS.SLASH.origin, "mg"), CHARS.SLASH.replaced);
};

const loadTemplate = (
  templatePath: string | undefined,
  defaultTemplatePath: string,
  defaultTemplate: string,
) => {
  let contents;
  try {
    contents = templatePath
      ? loadTemplateByPath(
          templatePath.toLowerCase() === "default"
            ? defaultTemplatePath
            : templatePath,
        )
      : defaultTemplate;
    contents = replaceTemplate(contents);
  } catch (error) {
    if (error instanceof Error) {
      error.message =
        "Failed to load template. Template path: '" +
        templatePath +
        "'.\n" +
        error.message;
      throw error;
    } else {
      throw (
        "Failed to load template. Template path: '" +
        templatePath +
        "'.\n" +
        error
      );
    }
  }
  return contents;
};

// Take a path and return an array that will contain the entire file list located at that path (sub directories and
// everything). For a file the matching array element will be a String containing it's name (no path). For a directory
// the matching element is going to be an Object that has a `name` key that holds the directory name (String) and a
// `tree` key that holds an Array returned from readDirTree
const readDirTree = (path: string): Array<Dir | string> => {
  const dirTree = readdirSync(path);
  let length = dirTree.length;
  const trees: Array<Dir | string> = [];

  while (length--) {
    const name = dirTree[length];
    const innerPath = resolve(path, name);
    const stats = lstatSync(innerPath);
    if (stats.isDirectory()) {
      // Create dir object
      // Replace dir name with dir tree
      trees[length] = new Dir(name, readDirTree(innerPath));
    } else {
      trees[length] = name;
    }
  }

  return trees;
};

// Take a path to pack, along with templates and return a xml (String) that can be placed as the value of a `Files` tag.
// The `exclude` parameter is used to decide if the file or directory should be added to xml (return true) or not (return
// false). If we fail to read the directory tree for the provided path, it will throw an appropriate error
const generateDirTreeXml = (
  path2Pack: string,
  dirTemplate: Handlebars.TemplateDelegate,
  fileTemplate: Handlebars.TemplateDelegate,
  exclude: string | undefined,
): string => {
  // Helper for the recursive creation of the xml
  const generateDirTreeXmlPart = (
    path: string,
    dirTree: Array<Dir | string>,
  ) => {
    const parts: string[] = [];
    dirTree.forEach(function (element) {
      const isDir = element instanceof Dir;
      const name = isDir ? element.name : element;
      const fullPath = join(path, name);
      let part;
      let filesXml;

      // Check if the caller wants to skip this file or directory
      if (
        exclude &&
        minimatch(fullPath, exclude, { windowsPathsNoEscape: false, dot: true })
      ) {
        return;
      }

      if (isDir) {
        // The element describes a directory
        filesXml = generateDirTreeXmlPart(fullPath, element.tree);
        part = dirTemplate({
          [VARS.DIR_NAME]: name,
          [VARS.FILES]: filesXml,
        });
      } else {
        // The element describes a file
        part = fileTemplate({
          [VARS.FILE_NAME]: element,
          [VARS.FILE_PATH]: fullPath,
        });
      }
      // Add the xml for the element
      parts.push(part);
    });

    // We return a xml string for the current dirTree
    return parts.join("");
  };

  let dirTree;
  try {
    dirTree = readDirTree(path2Pack);
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message =
        "Failed to read the directory tree of: '" +
        path2Pack +
        "'.\n" +
        error.message;
      throw error;
    } else {
      throw (
        "Failed to read the directory tree of: '" + path2Pack + "'.\n" + error
      );
    }
  }

  return generateDirTreeXmlPart(path2Pack, dirTree);
};

// This is the entry point to the module.
// In this function we synchronously generate an 'Enigma Virtual Box' project file. The file will include entries for
// all the files and dirs located at `path2Pack`, so when you process the project using Enigma's GUI/CLI you will get an
// executable with all the files packed into it.
// - entry (String) - the path to the directory with the content that we want to pack into the copy of inputExe
// - project-name (String) - the file path to which we want to save the generated evb file (e.g. 'build/myProject.evb')
// - input (String) - the input executable file path. Enigma packs the files from `path2Pack` into a copy of this exe
// - output (String) - the output executable file path. Enigma saves the packed file to this path
// - exclude (String) - optional, if provided it will be called with each file and directory from `path2Pack`. The
//         function should return true for any file or directory the user want to pack, and false for anything else
// - options (Object) - optional
//     - templatePath (Object) - optional, will default to the files in the templates directory:
//         - project (String) - optional, path to a project template
//         - dir (String) - optional, path to a directory template
//         - file (String) - optional, path to a file template
//     - evbOptions (Object) - optional:
//         - deleteExtractedOnExit (Boolean) - defaults to true
//         - compressFiles (Boolean) - defaults to true
//         - shareVirtualSystem (Boolean) - defaults to false
//         - mapExecutableWithTemporaryFile (Boolean) - defaults to true
//         - allowRunningOfVirtualExeFiles (Boolean) - defaults to true
//         - processesOfAnyPlatforms (Boolean) - defaults to false
export const generate = async (
  entry: string,
  options: GlobalCLIOptions,
): Promise<string> => {
  // Merge options with defaults
  options = merge(
    {
      // templatePath: {
      //   project: DEFAULT_TEMPLATE_PATH.PROJECT,
      //   dir: DEFAULT_TEMPLATE_PATH.DIR,
      //   file: DEFAULT_TEMPLATE_PATH.FILE,
      // },
      evbOptions: {
        deleteExtractedOnExit: "True",
        compressFiles: "True",
        shareVirtualSystem: "False",
        mapExecutableWithTemporaryFile: "True",
        allowRunningOfVirtualExeFiles: "True",
        processesOfAnyPlatforms: "False",
      },
    },
    options,
  );
  const templatePath = options.templatePath;
  const evbOptions = options.evbOptions;

  // Load templates
  const projectContent = loadTemplate(
    templatePath?.project,
    DEFAULT_TEMPLATE_PATH.PROJECT,
    DEFAULT_TEMPLATE.PROJECT,
  );
  const projectTemplate = Handlebars.compile(projectContent);

  const dirContent = loadTemplate(
    templatePath?.dir,
    DEFAULT_TEMPLATE_PATH.DIR,
    DEFAULT_TEMPLATE.DIR,
  );
  const dirTemplate = Handlebars.compile(dirContent);

  const fileContent = loadTemplate(
    templatePath?.file,
    DEFAULT_TEMPLATE_PATH.FILE,
    DEFAULT_TEMPLATE.FILE,
  );
  const fileTemplate = Handlebars.compile(fileContent);

  const files = generateDirTreeXml(
    resolve(entry),
    dirTemplate,
    fileTemplate,
    options.exclude || options.e,
  );

  const input = options.input || options.i;
  const output = options.output || options.o;

  // Fill the project template
  const content = projectTemplate({
    // Set input and output executables
    [VARS.INPUT_EXE]: resolve(input!),
    [VARS.OUTPUT_EXE]: resolve(output!),

    // Set options
    [VARS.OPT_DELETE_EXTRACTED]: evbOptions?.deleteExtractedOnExit || "True",
    [VARS.OPT_COMPRESS_FILES]: evbOptions?.compressFiles || "True",
    [VARS.OPT_SHARE_VIRTUAL_SYSTEM]: evbOptions?.shareVirtualSystem || "False",
    [VARS.OPT_MAP_WITH_TEMP]:
      evbOptions?.mapExecutableWithTemporaryFile || "True",
    [VARS.OPT_ALLOW_RUNNING_VIRTUAL_EXE]:
      evbOptions?.allowRunningOfVirtualExeFiles || "True",
    [VARS.OPT_PROCESSES_OF_ANY_PLATFORMS]:
      evbOptions?.processesOfAnyPlatforms || "False",

    // Add files
    [VARS.FILES]: files,
  })
    .replace(RegExp(CHARS.LT.replaced, "mg"), CHARS.LT.origin)
    .replace(RegExp(CHARS.GT.replaced, "mg"), CHARS.GT.origin)
    .replace(RegExp(CHARS.SLASH.replaced, "mg"), CHARS.SLASH.origin);

  const projectName = options.projectName || options.p || "project.evb";
  const outputPath = resolve(projectName!);

  // Save the project to file
  // Note: When you create a project manually using Enigma's GUI it prepends BOM (byte order mark) to the file.
  // fs.writeFile doesn't do that, but it doesn't seem to cause any issue with Enigma. If an issue related to the
  // missing BOM arises, we can add it by prepending '\ufeff' to projectTemplate (for details see:
  // http://stackoverflow.com/a/27975629)
  writeFileSync(outputPath, "\uFEFF" + content, "utf8");

  return outputPath;
};
