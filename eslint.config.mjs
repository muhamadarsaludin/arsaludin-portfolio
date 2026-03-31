import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  {
    rules: {
      // --- Styling Dasar ---
      semi: ["error", "never"],
      quotes: ["error", "double", { avoidEscape: true }],

      // --- Logic & Clean Code ---
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off", // Dimatikan agar tidak bentrok dengan rule TS di bawah

      // --- TypeScript (Senior Level) ---
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "error", // Sangat pro untuk performa build
      "@typescript-eslint/no-explicit-any": "warn",

      // --- React / Next.js Cleanliness ---
      "react/self-closing-comp": "error",
      "react/jsx-no-useless-fragment": "warn",
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
])

export default eslintConfig
