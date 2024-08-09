module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest", "react-hooks", "prettier"],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "@typescript-eslint/no-explicit-any": ["off"],
  },
};
