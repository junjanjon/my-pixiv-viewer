import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended"), {
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: 2015,
        sourceType: "module",
    },

    rules: {
        "no-mixed-spaces-and-tabs": ["error"],
        indent: ["error", 4],
        "no-trailing-spaces": ["error"],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single"],
        semi: ["error", "always"],
        "no-console": "off",
        "no-var": ["error"],
        eqeqeq: ["error"],
        "brace-style": ["error", "allman"],
    },
}];