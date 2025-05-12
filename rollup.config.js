import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
  input: ["src/cli.ts", "src/index.ts"],
  output: {
    dir: "dist",
  },
  external: ["commander"],
  plugins: [
    json(),
    typescript({
      exclude: ["**/*.test.ts", "**/test/**"],
    }),
  ],
};
