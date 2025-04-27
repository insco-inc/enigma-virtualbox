import { defineConfig, type Options } from "tsup";
import * as pkgInfo from "./package.json";

const banner = `
/** 
 * Version: ${pkgInfo.version}
 *  
 * Copyright (c) 2024 kjxbyz. All rights reserved.
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
    entry: ["src/index.ts"],
    tsconfig: "./tsconfig.json",
  },
]);
