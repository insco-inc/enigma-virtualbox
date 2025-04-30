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
