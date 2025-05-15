import type { VariableNames } from "./types";

export const PRE_TAG_INDENTS = /^\s+?</gm;

export const VARS: VariableNames = {
  DIR_NAME: "dirName",
  FILES: "files",
  FILE_NAME: "fileName",
  FILE_PATH: "filePath",
  INPUT_EXE: "input",
  OUTPUT_EXE: "output",

  OPT_DELETE_EXTRACTED: "deleteExtractedOnExit",
  OPT_COMPRESS_FILES: "compressFiles",
  OPT_SHARE_VIRTUAL_SYSTEM: "shareVirtualSystem",
  OPT_MAP_WITH_TEMP: "mapExecutableWithTemporaryFile",
  OPT_ALLOW_RUNNING_VIRTUAL_EXE: "allowRunningOfVirtualExeFiles",
  OPT_PROCESSES_OF_ANY_PLATFORMS: "processesOfAnyPlatforms",
};
