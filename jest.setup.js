// Setup file for Jest
jest.mock("react-native-mmkv");
jest.mock("expo-localization");
jest.mock("react-native-keyboard-controller", () => {
  const { View, ScrollView } = require("react-native");
  return {
    KeyboardProvider: ({ children }) => children,
    KeyboardAwareScrollView: ScrollView,
    KeyboardAvoidingView: View,
    KeyboardStickyView: View,
    useKeyboardHandler: jest.fn(),
    useReanimatedKeyboardAnimation: () => ({
      height: { value: 0 },
      progress: { value: 0 },
    }),
  };
});

const { i18n } = require("./lib/i18n");

beforeEach(async () => {
  if (i18n.language !== "en") {
    await i18n.changeLanguage("en");
  }
});
