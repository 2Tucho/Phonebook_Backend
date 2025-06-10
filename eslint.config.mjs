import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
        rules: {
            "eqeqeq": "error",
            "no-trailing-spaces": "error",
            "object-curly-spacing": [
                "error", "always"
            ],
            "arrow-spacing": [
                "error", { "before": true, "after": true }
            ],
        },
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: globals.node
        }
    },
    {
        plugins: { "@stylistic": stylistic },
        rules:
        {
            "@stylistic/indent": ["error", 4],
            "@stylistic/linebreak-style": ["error", "unix"],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": ["error", "always"],
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        languageOptions: { globals: globals.browser }
    },
    [globalIgnores(["dist/"])],
]);