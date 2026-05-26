const loginTests = [
  {
    name: 'launches the NGO Booking package',
    fn: async (driver, helpers) => {
      const packageName = await driver.getCurrentPackage();
      const APP_PACKAGE = 'com.ngo_booking';

      if (packageName !== APP_PACKAGE) {
        throw new Error(`Expected ${APP_PACKAGE}, received ${packageName}`);
      }
    },
  },
  {
    name: 'shows the login screen after splash',
    fn: async (driver, helpers) => {
      const {waitForDisplayed, byAccessibilityId} = helpers;

      await waitForDisplayed(driver, byAccessibilityId('login-user-id-input'));
      await waitForDisplayed(driver, byAccessibilityId('login-send-otp-button'));
      await waitForDisplayed(driver, byAccessibilityId('login-mode-password'));
    },
  },
  {
    name: 'validates empty OTP login form',
    fn: async (driver, helpers) => {
      const {waitForDisplayed, byAccessibilityId, byText} = helpers;

      const sendOtpButton = await waitForDisplayed(
        driver,
        byAccessibilityId('login-send-otp-button'),
      );

      await sendOtpButton.click();
      await waitForDisplayed(driver, byText('Phone number is required'));
    },
  },
  {
    name: 'validates empty password login form',
    fn: async (driver, helpers) => {
      const {waitForDisplayed, byAccessibilityId, byText} = helpers;

      const passwordMode = await waitForDisplayed(
        driver,
        byAccessibilityId('login-mode-password'),
      );

      await passwordMode.click();
      await waitForDisplayed(driver, byAccessibilityId('login-password-input'));

      const loginButton = await waitForDisplayed(
        driver,
        byAccessibilityId('login-password-button'),
      );

      await loginButton.click();
      await waitForDisplayed(driver, byText('User ID is required'));
      await waitForDisplayed(driver, byText('Password is required'));
    },
  },
];

module.exports = loginTests;
