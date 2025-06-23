import globals from "globals";
import eslintJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import tsEslint from "typescript-eslint";

export default [
    // --- GLOBAL CONFIGURATION ---
    { ignores: ["frontend/dist/**"] },
    {
        files: ["*"],
        ignores: [
            "node_modules/",
            "build/",
            "dist/",
            ".git/",
            ".docker/",
            ".env",
            "*.log",
            "*.md",
            "*.json",
            "**/package-lock.json",
            "Dockerfile",
            "docker-compose.yml",
            ".eslintignore",
            ".gitignore",
            ".prettierignore",
        ],
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            ...eslintConfigPrettier.rules,
            "prettier/prettier": "error",
        },
    },

    // --- Base JS/JSX/TS/TSX Configuration ---
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsEslint.parser,
            ecmaVersion: 12,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        plugins: {
            "@typescript-eslint": tsEslint.plugin,
        },
        rules: {
            ...eslintJs.configs.recommended.rules,
            ...tsEslint.configs.recommended.rules,
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "no-undef": "off",
        },
    },

    // --- Backend Configuration ---
    {
        files: ["backend/**/*.{js,ts}"],
        languageOptions: {
            globals: {
                ...globals.node,
                browser: false,
            },
        },
        rules: {
            "no-console": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },

    // --- Frontend Configuration (React) ---
    {
        files: ["frontend/**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                node: false,
            },
        },
        plugins: {
            react: pluginReact,
            "react-hooks": pluginReactHooks,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...pluginReact.configs.recommended.rules,
            ...pluginReactHooks.configs.recommended.rules,
            "no-console": "warn",
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
        },
    },
];
