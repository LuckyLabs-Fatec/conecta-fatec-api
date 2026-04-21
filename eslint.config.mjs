import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import security from "eslint-plugin-security";
import promise from "eslint-plugin-promise";
import eslintComments from "eslint-plugin-eslint-comments";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.node },
    plugins: {
      js,
      import: importPlugin,
      security,
      promise,
      "eslint-comments": eslintComments,
    },
    extends: [
      "js/recommended",
      ...tseslint.configs.recommended,
    ],
    rules: {
      "import/order": ["warn", { "newlines-between": "always" }],
      "promise/always-return": "off",
      "eslint-comments/no-unused-disable": "warn",
    },
  },
]);
