const getLocales = jest.fn(() => [
  {
    languageCode: "en",
    languageTag: "en-US",
  },
]);

module.exports = {
  getLocales,
};
