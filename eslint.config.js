import globals from "globals";
import eslintJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import tsEslint from "typescript-eslint";

export default [
    // --- GLOBAL CONFIGURATION ---
    {
        files: ["**/*"],
        ignores: [
            "node_modules/",
            "build/",
            "dist/",
            "package-lock.json",
            ".git/",
            ".docker/",
            ".env",
            "*.log",
            "*.md",
            "**/package-lock.json",
            "Dockerfile",
            "docker-compose.yml",
            "frontend/build/",
        ],
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
            ...tsEslint.configs.recommended.rules, // Apply recommended TypeScript rules
            "no-unused-vars": "off", // Disable base ESLint no-unused-vars
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "no-undef": "off", // Disable base ESLint no-undef
        },
    },

    // --- Prettier Configuration ---
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            ...eslintConfigPrettier.rules,
            "prettier/prettier": "error",
            endOfLine: "off",
        },
    },

    // --- Backend Configuration ---
    {
        files: ["backend/**/*.js", "backend/**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.node,
                browser: false,
            },
        },
        rules: {
            "no-console": "off",
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
