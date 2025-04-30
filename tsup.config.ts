import { defineConfig, type Options } from "tsup";
import * as pkgInfo from "./package.json";

const banner = `
/** 
 * Version: ${pkgInfo.version}
 *  
 * Copyright (c) 2025 kjxbyz. All rights reserved.
 */
`;

const options: Options = {
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  dts: true,
  format: ["cjs", "esm"],
  banner: {
    js: banner,
  },
};

export default defineConfig([
  {
    ...options,
    entry: ["src/cli.ts"],
    dts: false,
    noExternal: ["cac", "handlebars", "minimatch", "lodash-es"],
    treeshake: true,
  },
  {
    ...options,
    entry: ["src/index.ts", "src/main.ts", "src/version.ts"],
    tsconfig: "./tsconfig.json",
  },
]);
