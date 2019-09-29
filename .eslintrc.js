module.exports = {
    "env": {
        "browser": true,
        "jest": true,
        "mocha": true,
        "node": true,
        "es6": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
    ],
    "rules": {
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/interface-name-prefix": "error",
        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/no-this-alias": "error",
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
            "varsIgnorePattern": "^_"
        }],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/semi": "error",
        "camelcase": "error",
        "no-param-reassign": "error",
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
