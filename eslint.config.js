// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const boundaries = require("eslint-plugin-boundaries");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },

  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        {
          mode: "full",
          type: "unknown",
          pattern: ["*"],
        },
        {
          mode: "full",
          type: "shared",
          pattern: [
            "utils/**/*",
            "components/**/*",
            "lib/**/*",
            "assets/**/*",
            "hooks/**/*",
            "types/**/*",
            "context/**/*",
          ],
        },
        {
          type: "app",
          mode: "full",
          capture: ["_", "fileName"],
          pattern: ["app/**/*"],
        },
        {
          mode: "full",
          type: "feature",
          capture: ["featureName"],
          pattern: ["features/**/*"],
        },
      ],
    },
    rules: {
      "boundaries/no-unknown-files": ["error"],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: ["shared"],
              allow: ["shared"],
            },
            {
              from: ["feature"],
              allow: ["shared"],
            },
            {
              from: ["feature"],
              disallow: [["feature", { notSame: ["featureName"] }]], // 🔒 disallow cross-feature access
            },
            {
              from: ["app"],
              allow: ["shared", "feature"],
            },
            {
              from: ["app"],
              allow: [["app", { fileName: "*.css" }]],
            },
            {
              from: ["*"],
              disallow: ["unknown"],
            },
          ],
        },
      ],
    },
  },
]);
