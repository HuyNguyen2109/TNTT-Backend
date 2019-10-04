module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 8
  },
  "rules": {
    /* 2 indentation */
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    /* UNIX-style newlines (\n) */
    "linebreak-style": [
      "error",
      "unix"
    ],
    /* Use single quotes */
    "quotes": [
      "error",
      "single"
    ],
    /* Require quotes around object literal property names */
    "quote-props": ["error", "always"],
    /* Use Semicolons */
    "semi": [
      "error",
      "always"
    ],
    /* No trailing spaces */
    "no-trailing-spaces": ["error",
      {
        "skipBlankLines": true,
        "ignoreComments": true
      }
    ],
    /* No multi spaces */
    "no-multi-spaces": "error",
    /* Disallow variable redeclaration */
    "no-redeclare": "error",
    /* Disallow Early Use, use with ES6 */
    "no-use-before-define": "error",
    /* Disallow Unused Variables */
    "no-unused-vars": [
      "error",
      {
        "vars": "all",
        "args": "after-used",
        "ignoreRestSiblings": false
      }
    ],
    /* No multiple lines */
    "no-multiple-empty-lines": "error",
    /* Disallow mixed spaces and tabs for indentation */
    "no-mixed-spaces-and-tabs": [
      "error",
      "smart-tabs"
    ],
    /* Disallow whitespace before properties */
    "no-whitespace-before-property": "error",
    /* Disallow empty function, block */
    "no-empty": "error",
    /* Disallow empty function */
    "no-empty-function": "error",
    /* Disallow duplicate arguments in function definitions */
    "no-dupe-args": "error",
    /* Disallow duplicate keys in object literals */
    "no-dupe-keys": "error",
    /* Disallow duplicate module imports */
    "no-duplicate-imports": "error",
    /* Disallow duplicate name in class members */
    "no-dupe-class-members": "error",
    /* Disallow use of this/super before calling super() in constructors */
    "no-this-before-super": "error",
    /* Disallow unreachable code after return, throw, continue, and break statements */
    "no-unreachable": "error",
    /* Enforce consistent brace style for blocks */
    "brace-style": "error",
    /* Treat var as Block Scoped */
    "block-scoped-var": "error",
    /* Use camelCase */
    "camelcase": ["error", {
      "properties": "always"
    }],
    /* Require === and !== */
    "eqeqeq": "error",
    /* Comma rules */
    "comma-dangle": [
      "error",
      "never"
    ],
    "comma-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ],
    /* Require an empty line before return statements */
    "newline-before-return": "error",
    /* Use space before comment */
    "spaced-comment": ["error", "always"],
    "require-jsdoc": "off",
    /* Enforce valid JSDoc comments */
    "valid-jsdoc": ["error", {
      "requireReturnDescription": false
    }],
    /* Enforce or disallow capitalization of the first letter of a comment */
    "capitalized-comments": [
      "error",
      "always",
      {
        "ignorePattern": "pragma|ignored",
        "ignoreInlineComments": false,
        "ignoreConsecutiveComments": true
      }
    ],
    /* Max character per line */
    "max-len": ["error", {
      "code": 140
    }],
    /* Declare one variable per var statement */
    "max-statements-per-line": ["error", {
      "max": 1
    }],
    /* Method chaining */
    "newline-per-chained-call": ["error", {
      "ignoreChainWithDepth": 2
    }],
    /* Requires At Top */
    "global-require": "error",
    /* Getters and setters */
    "accessor-pairs": "error",
    /* Do not extend built-in prototypes */
    "no-prototype-builtins": "error",
    /* No whitespace at the end of line or on blank lines */
    "no-trailing-spaces": "error",
    /* No mixed between spaces and tabs */
    "no-mixed-spaces-and-tabs": "error",
    /* Blocks should always use braces, and always go on multiple lines. */
    "curly": "error",
    /* Block spacing */
    "block-spacing": "error",
    /* New line at the end of each file */
    "eol-last": ["error", "always"],
    /* ES6 rules */
    "arrow-body-style": ["error", "always"],
    "arrow-spacing": "error",
    "constructor-super": "error",
    "no-const-assign": "error",
    "no-this-before-super": "error",
    "no-console": "warn",
    /* Disallow else blocks after return statements in if statements */
    "no-else-return": "error",
    /* Enforce a maximum depth that blocks can be nested */
    "max-depth": ["error", 4],
    /* Specify the maximum number of statements allowed in a function. */
    "max-statements": ["error", 50, {
      "ignoreTopLevelFunctions": true
    }],
    /* Disallow Initializing to undefined, "undefined" should not be assigned */
    "no-undef-init": "error",
    "no-undef": 0
  }
};