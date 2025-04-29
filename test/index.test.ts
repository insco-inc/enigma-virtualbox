import { test, assert } from "vitest";
import { generate, version } from "../src";
import pkgInfo from "../package.json";

test("simple", () => {
  generate(".github", {
    input: ".npmrc",
    output: "package.json",
    projectName: "project.evb",
  });
  generate(".github", {
    input: ".npmrc",
    output: "package.json",
    projectName: "project2.evb",
    exclude: "**/publish.yml",
  });
  generate(".github", {
    input: ".npmrc",
    output: "package.json",
    projectName: "project3.evb",
    exclude: "**/publish.yml",
    evbOptions: {
      deleteExtractedOnExit: "False",
      compressFiles: "False",
    },
  });
  assert.equal(version, pkgInfo.version);
});
