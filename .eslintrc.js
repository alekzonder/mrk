module.exports = {
  extends: ["./node_modules/@0devs/package/config/eslint-ts.js", "prettier"],
  rules: {
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "implicit-arrow-linebreak": ["off"],
    "import/prefer-default-export": ["off"],
    "@typescript-eslint/ban-ts-ignore": ["off"],
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    camelcase: "off",
    semi: "off",
    "@typescript-eslint/semi": ["error"],
    "import/no-extraneous-dependencies": "off",
    "import/first": ["off"],
  },
};
