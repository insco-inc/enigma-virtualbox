export type EvbOptionTypes =
  | "deleteExtractedOnExit"
  | "compressFiles"
  | "shareVirtualSystem"
  | "mapExecutableWithTemporaryFile"
  | "allowRunningOfVirtualExeFiles"
  | "processesOfAnyPlatforms";
export type EvbOptions = {
  [key in EvbOptionTypes]: string;
};

// global options
export interface GlobalCLIOptions {
  "--"?: string[];
  input?: string;
  output?: string;
  projectName: string;
  exclude?: string;
  evbOptions?: EvbOptions;
}
