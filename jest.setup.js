// Setup file for Jest
jest.mock("react-native-mmkv");
jest.mock("expo-localization");

const { i18n } = require("./lib/i18n");

beforeEach(async () => {
  if (i18n.language !== "en") {
    await i18n.changeLanguage("en");
  }
});
