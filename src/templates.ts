import { join } from "node:path";

export type TemplateTypes = "PROJECT" | "DIR" | "FILE";

export type TemplatePath = {
  [key in TemplateTypes]: string;
};

// Helper to get absolute path to template
const resolveDefaultTemplatePath = (templateName: string): string => {
  return join(__dirname, "..", "templates", templateName);
};

const dirTemplate = `
<File>
  <Type>3</Type>
  <Name>{{{dirName}}}</Name>
  <Action>0</Action>
  <OverwriteDateTime>False</OverwriteDateTime>
  <OverwriteAttributes>False</OverwriteAttributes>
  <Files>{{{files}}}</Files>
  <HideFromDialogs>0</HideFromDialogs>
</File>
`;

const fileTemplate = `
<File>
  <Type>2</Type>
  <Name>{{{fileName}}}</Name>
  <File>{{{filePath}}}</File>
  <ActiveX>False</ActiveX>
  <ActiveXInstall>False</ActiveXInstall>
  <Action>0</Action>
  <OverwriteDateTime>False</OverwriteDateTime>
  <OverwriteAttributes>False</OverwriteAttributes>
  <PassCommandLine>False</PassCommandLine>
  <HideFromDialogs>0</HideFromDialogs>
</File>
`;

const projectTemplate = `
<?xml version="1.0" encoding="windows-1252"?>
<>
<InputFile>{{{input}}}</InputFile>
<OutputFile>{{{output}}}</OutputFile>
<Files>
  <Enabled>True</Enabled>
  <DeleteExtractedOnExit>{{{deleteExtractedOnExit}}}</DeleteExtractedOnExit>
  <CompressFiles>{{{compressFiles}}}</CompressFiles>
  <Files>
    <File>
      <Type>3</Type>
      <Name>%DEFAULT FOLDER%</Name>
      <Action>0</Action>
      <OverwriteDateTime>False</OverwriteDateTime>
      <OverwriteAttributes>False</OverwriteAttributes>
      <HideFromDialogs>0</HideFromDialogs>
      <Files>{{{files}}}</Files>
    </File>
  </Files>
</Files>
<Registries>
  <Enabled>False</Enabled>
  <Registries>
    <Registry>
      <Type>1</Type>
      <Virtual>True</Virtual>
      <Name>Classes</Name>
      <ValueType>0</ValueType>
      <Value/>
      <Registries/>
    </Registry>
    <Registry>
      <Type>1</Type>
      <Virtual>True</Virtual>
      <Name>User</Name>
      <ValueType>0</ValueType>
      <Value/>
      <Registries/>
    </Registry>
    <Registry>
      <Type>1</Type>
      <Virtual>True</Virtual>
      <Name>Machine</Name>
      <ValueType>0</ValueType>
      <Value/>
      <Registries/>
    </Registry>
    <Registry>
      <Type>1</Type>
      <Virtual>True</Virtual>
      <Name>Users</Name>
      <ValueType>0</ValueType>
      <Value/>
      <Registries/>
    </Registry>
    <Registry>
      <Type>1</Type>
      <Virtual>True</Virtual>
      <Name>Config</Name>
      <ValueType>0</ValueType>
      <Value/>
      <Registries/>
    </Registry>
  </Registries>
</Registries>
<Packaging>
  <Enabled>False</Enabled>
</Packaging>
<Options>
  <ShareVirtualSystem>{{{shareVirtualSystem}}}</ShareVirtualSystem>
  <MapExecutableWithTemporaryFile>{{{mapExecutableWithTemporaryFile}}}</MapExecutableWithTemporaryFile>
  <TemporaryFileMask/>
  <AllowRunningOfVirtualExeFiles>{{{allowRunningOfVirtualExeFiles}}}</AllowRunningOfVirtualExeFiles>
  <ProcessesOfAnyPlatforms>{{{processesOfAnyPlatforms}}}</ProcessesOfAnyPlatforms>
</Options>
<Storage>
  <Files>
    <Enabled>False</Enabled>
    <Folder>%DEFAULTFOLDER%\\</Folder>
    <RandomFileNames>False</RandomFileNames>
    <EncryptContent>False</EncryptContent>
  </Files>
</Storage>
</>
`;

export const DEFAULT_TEMPLATE_PATH: TemplatePath = {
  PROJECT: resolveDefaultTemplatePath("project.template.hbs"),
  DIR: resolveDefaultTemplatePath("dir.template.hbs"),
  FILE: resolveDefaultTemplatePath("file.template.hbs"),
};

export const DEFAULT_TEMPLATE: TemplatePath = {
  PROJECT: projectTemplate,
  DIR: dirTemplate,
  FILE: fileTemplate,
};
