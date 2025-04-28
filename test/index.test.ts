import { test, assert } from "vitest";
import { version } from "../src";
import pkgInfo from "../package.json";

test("simple", () => {
  assert.equal(version, pkgInfo.version);
});
