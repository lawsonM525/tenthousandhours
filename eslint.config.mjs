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
    },
  },
  {
    ignores: [".next/*", "node_modules/*"],
  },
];
