module.exports = {
    ignorePatterns: ["*.js"],
    "env": {
        "browser": true,
        "jest": true,
        "mocha": true,
        "node": true,
        "es6": true
    },
    "globals": {
        BigInt: true,
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "settings": {
      "react": {
          "version": "detect",
      }
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    "rules": {
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/interface-name-prefix": ["error", { "prefixWithI": "always" }],
        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/explicit-member-accessibility": "error",
        "@typescript-eslint/no-this-alias": "error",
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
            "varsIgnorePattern": "^_"
        }],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/semi": "error",
        "camelcase": "error",
        "no-param-reassign": "warn",
        "max-len": ["error", {
            "code": 120
        }],
        "new-parens": "error",
        "no-caller": "error",
        "no-bitwise": "off",
        "no-multiple-empty-lines": "error",
        "no-console": "warn",
        "no-var": "error",
        "object-curly-spacing": ["error", "never"],
        "prefer-const": "error",
        "quotes": ["error", "double"],
        "semi": "off",
        "react/prop-types": "off"
    }
};
