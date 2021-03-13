import * as Path from "path";
import rollupResolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import rollupAlias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import rollupSvelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import rollupTs from "@rollup/plugin-typescript";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";

const svConf = require("./svelte.config.js");

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  warning.code === "THIS_IS_UNDEFINED" ||
  onwarn(warning);

const replace = {
  preventAssignment: true,
  values: {
    "process.browser": true,
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
};

const alias = rollupAlias({
  entries: {
    "@": Path.join(__dirname, "src"),
  },
});

const resolveOpts = {
  dedupe: ["svelte"],
  extensions: [".mjs", ".node", ".ts", ".js", ".json", ".svelte"],
};

export default {
  client: {
    input: config.client.input().replace(/\.js$/, ".ts"),
    output: config.client.output(),
    plugins: [
      alias,
      rollupReplace(replace),
      rollupTs({ sourceMap: dev }),
      rollupSvelte({ ...svConf, compilerOptions: { hydratable: true } }),
      url({
        sourceDir: Path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
      }),
      rollupResolve({ ...resolveOpts, browser: true }),
      commonjs(),

      legacy &&
        babel({
          extensions: [".js", ".mjs", ".html", ".svelte"],
          babelHelpers: "runtime",
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead",
              },
            ],
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: { server: config.server.input().server.replace(/\.js$/, ".ts") },
    output: config.server.output(),
    plugins: [
      alias,
      rollupReplace(replace),
      rollupTs({ sourceMap: dev }),
      rollupSvelte({
        ...svConf,
        compilerOptions: { generate: "ssr", hydratable: true },
      }),
      url({
        sourceDir: Path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
        emitFiles: false, // already emitted by client build
      }),
      rollupResolve(resolveOpts),
      commonjs(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules
    ),
    preserveEntrySignatures: "strict",
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input().replace(/\.js$/, ".ts"),
    output: config.serviceworker.output(),
    plugins: [
      rollupResolve(),
      replace,
      commonjs(),
      rollupTs({ sourceMap: dev }),
      !dev && terser(),
    ],
    preserveEntrySignatures: false,
    onwarn,
  },
};
