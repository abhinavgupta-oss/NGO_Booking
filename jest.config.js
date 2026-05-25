module.exports = {
  preset: '@react-native/jest-preset',
  cacheDirectory: '<rootDir>/.jest-cache',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-linear-gradient)/)',
  ],
  moduleNameMapper: {
    '\\.(ttf|png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
