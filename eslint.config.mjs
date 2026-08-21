// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import boundaries from "eslint-plugin-boundaries";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/sw.js",
      ".open-next/**",
    ],
  },
  {
    plugins: {
      boundaries,
      "unused-imports": unusedImports,
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app" },
        { type: "feature", pattern: "src/features/*", capture: ["feature"] },
        { type: "module", pattern: "src/modules/*", capture: ["module"] },
        { type: "components", pattern: "src/components" },
        { type: "lib", pattern: "src/lib" },
        { type: "config", pattern: "src/config" },
        { type: "i18n", pattern: "src/i18n" },
      ],
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: { element: { type: "feature" } },
              disallow: [{ to: { element: { type: "app" } } }],
              message: "Features must not import app routes.",
            },
            {
              from: { element: { type: "module" } },
              disallow: [
                { to: { element: { type: "app" } } },
                { to: { element: { type: "feature" } } },
              ],
              message: "Modules must not import app or features.",
            },
            {
              from: { element: { type: "components" } },
              disallow: [
                { to: { element: { type: "app" } } },
                { to: { element: { type: "feature" } } },
                { to: { element: { type: "module" } } },
              ],
              message:
                "Shared components must not import app, features, or modules.",
            },
            {
              from: { element: { type: "lib" } },
              disallow: [
                { to: { element: { type: "app" } } },
                { to: { element: { type: "feature" } } },
                { to: { element: { type: "module" } } },
              ],
              message: "lib is platform-only — no domain modules.",
            },
          ],
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/modules/*/repositories/**",
                "@/modules/*/domain/**",
                "@/modules/*/services/**",
                "@/modules/*/validators/**",
                "@/modules/*/di",
              ],
              message:
                "Import module public API (@/modules/<name>) only — not internals.",
            },
          ],
        },
      ],
    },
  },
  ...storybook.configs["flat/recommended"]
];

export default eslintConfig;
