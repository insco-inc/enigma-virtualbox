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
  assert.equal(version, pkgInfo.version);
});
