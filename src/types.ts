export type TemplateOptionTypes = "project" | "dir" | "file";

export type TemplateOptions = {
  [key in TemplateOptionTypes]?: string;
};

export type EvbOptionTypes =
  | "deleteExtractedOnExit"
  | "compressFiles"
  | "shareVirtualSystem"
  | "mapExecutableWithTemporaryFile"
  | "allowRunningOfVirtualExeFiles"
  | "processesOfAnyPlatforms";

export type EvbOptions = {
  [key in EvbOptionTypes]?: string;
};

// global options
export interface GlobalCLIOptions {
  "--"?: string[];
  input?: string;
  i?: string;
  output?: string;
  o?: string;
  projectName?: string;
  p?: string;
  exclude?: string;
  e?: string;
  templatePath?: TemplateOptions;
  evbOptions?: EvbOptions;
}

export type VariableTypes =
  | "DIR_NAME"
  | "FILES"
  | "FILE_NAME"
  | "FILE_PATH"
  | "INPUT_EXE"
  | "OUTPUT_EXE"
  | "OPT_DELETE_EXTRACTED"
  | "OPT_COMPRESS_FILES"
  | "OPT_SHARE_VIRTUAL_SYSTEM"
  | "OPT_MAP_WITH_TEMP"
  | "OPT_ALLOW_RUNNING_VIRTUAL_EXE"
  | "OPT_PROCESSES_OF_ANY_PLATFORMS";

export type VariableNames = {
  [key in VariableTypes]: string;
};
