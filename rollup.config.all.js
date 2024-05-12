import { babel } from "@rollup/plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import localResolve from "@haensl/rollup-plugin-local-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";
import css from 'rollup-plugin-import-css';
import packageJson from "./package.json";
const outputCommonConf = {
  sourcemap: "inline",
  exports: "named",
  globals: {
    react: "React",
    "react-dom/client": "ReactDOM",
  },
};

export default [
  {
    input: "./src/index.tsx",
    output: [
      {
        file: packageJson["umd:main"],
        format: "umd",
        name: "ReactScriptTag",
        ...outputCommonConf,
      },
      {
        file: packageJson.main,
        format: "cjs",
        ...outputCommonConf,
      },
      {
        file: packageJson.module,
        format: "es",
        ...outputCommonConf,
      },
    ],
    plugins: [
      peerDepsExternal(),
      localResolve(),
      babel({
        exclude: "node_modules/**, src/tests/**",

        babelHelpers: "external",
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true,
      }),
      
      css(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
        tsconfigOverride: {
          include: ["src/index.tsx"],
          outDir: "lib",
        },
      }),

      terser({
        format: {
          comments: "some",
          preamble: "/* react-linkedinbadge */",
        },
      }),

      filesize(),
    ],
    external: ["react", "react-dom", "styled-components"],
  },
 
];
