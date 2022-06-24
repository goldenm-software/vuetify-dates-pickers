/* eslint-disable */
module.exports = {
  "root": true,
    "env": {
      "node": true
    },
    "plugins": [
      "vue"
    ],
    "extends": [
      "plugin:vue/recommended",
      "standard"
    ],
    "parserOptions": {
      "parser": "@babel/eslint-parser"
    },
    "rules": {
      "vue/component-name-in-template-casing": [
        "error",
        "kebab-case",
        {
          "ignores": []
        }
      ],
      "no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_"
        }
      ],
      "vue/max-attributes-per-line": [
        "error",
        {
          "singleline": 5,
          "multiline": {
            "max": 5,
            "allowFirstLine": true
          }
        }
      ],
      "vue/custom-event-name-casing": "off",
      "vue/valid-v-slot": "off",
      "vue/attribute-hyphenation": "off",
      "vue/singleline-html-element-content-newline": "off",
      "handle-callback-err": "off",
      "eol-last": "off",
      "no-trailing-spaces": "off"
    }
}