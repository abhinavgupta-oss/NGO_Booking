jest.mock(
  'react-native-device-info',
  () => require('react-native-device-info/jest/react-native-device-info-mock'),
);

jest.mock('react-native-webview', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MockWebView = props => React.createElement(View, props);

  return {
    __esModule: true,
    default: MockWebView,
    WebView: MockWebView,
  };
});

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));
