import * as Path from "path";
import rollupResolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import rollupAlias from "@rollup/plugin-alias";
import rollupJson from "@rollup/plugin-json";
import rollupCjs from "@rollup/plugin-commonjs";
import rollupUrl from "@rollup/plugin-url";
import rollupSvelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import rollupTs from "rollup-plugin-typescript2";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";
import * as Dotenv from "dotenv";

process.env.NODE_ENV === "development" &&
  Dotenv.config({ path: Path.join(__dirname, "dev.env") });

if (!process.env.WS_URL) throw new Error("WS_URL not defined");

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  warning.code === "THIS_IS_UNDEFINED" ||
  onwarn(warning);

const commonPlugins = ({ ssr }) => [
  rollupAlias({
    entries: {
      "@bamba/common": Path.join(__dirname, "../common/src"),
      "@/components": Path.join(__dirname, "src/components"),
    },
  }),
  rollupReplace({
    preventAssignment: true,
    values: {
      "process.browser": true,
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
  }),
  rollupConfig({
    alias: "@/config",
    values: {
      wsUrl: process.env.WS_URL,
    },
  }),
  rollupTs({
    sourceMap: dev,
  }),
  rollupJson(),
  rollupSvelte({
    ...require("./svelte.config.js"),
    compilerOptions: { generate: ssr ? "ssr" : undefined, hydratable: true },
  }),
  rollupUrl({
    sourceDir: Path.resolve(__dirname, "src/node_modules/images"),
    publicPath: "/client/",
    emitFiles: !ssr,
  }),
  rollupResolve({
    dedupe: ["svelte"],
    extensions: [".mjs", ".node", ".ts", ".js", ".json", ".svelte"],
    browser: !ssr,
  }),
  rollupCjs(),
];

const rollupConfig = ({ alias, values }) => ({
  name: "rollup-config",
  resolveId: (source) => (source === alias ? source : null),
  load: (id) =>
    id === alias ? `export default ${JSON.stringify(values)}` : null,
});

export default {
  client: {
    input: Path.join(__dirname, "src/client.ts"),
    output: config.client.output(),
    plugins: [
      ...commonPlugins({ ssr: false }),
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
    input: { server: Path.join(__dirname, "src/server.ts") },
    output: config.server.output(),
    plugins: [...commonPlugins({ ssr: true })],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules
    ),
    preserveEntrySignatures: "strict",
    onwarn,
  },

  serviceworker: {
    input: Path.join(__dirname, "src/worker/index.ts"),
    output: config.serviceworker.output(),
    plugins: [
      rollupResolve(),
      rollupReplace,
      rollupCjs(),
      rollupTs({ sourceMap: dev }),
      !dev && terser(),
    ],
    preserveEntrySignatures: false,
    onwarn,
  },
};
