import nextConfig from "@next/eslint-plugin-next";
import reactConfig from "eslint-plugin-react";
import hooksConfig from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextConfig,
      "react": reactConfig,
      "react-hooks": hooksConfig,
    },
    rules: {
      ...nextConfig.configs.recommended.rules,
      ...nextConfig.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    ignores: [".next/*", "node_modules/*"],
  },
];
