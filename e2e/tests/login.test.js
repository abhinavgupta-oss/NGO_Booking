const loginTests = [
  {
    name: 'launches the NGO Booking package',
    fn: async (driver) => {
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
      const { waitForDisplayed, byAccessibilityId } = helpers;

      await waitForDisplayed(
        driver,
        byAccessibilityId('login-Phone-input'),
      );

      await waitForDisplayed(
        driver,
        byAccessibilityId('login-Send-OTP'),
      );

      await waitForDisplayed(
        driver,
        byAccessibilityId('login-mode-password'),
      );
    },
  },

  {
    name: 'validates empty OTP login form',
    fn: async (driver, helpers) => {
      const { waitForDisplayed, byAccessibilityId, byText } = helpers;

      const sendOtpButton = await waitForDisplayed(
        driver,
        byAccessibilityId('login-Send-OTP'),
      );

      await sendOtpButton.click();

      await waitForDisplayed(
        driver,
        byText('Phone number is required'),
      );
    },
  },

  {
    name: 'validates empty password login form',
    fn: async (driver, helpers) => {
      const { waitForDisplayed, byAccessibilityId, byText } = helpers;

      const passwordMode = await waitForDisplayed(
        driver,
        byAccessibilityId('login-mode-password'),
      );

      await passwordMode.click();

      await waitForDisplayed(
        driver,
        byAccessibilityId('login-Password-input'),
      );

      const loginButton = await waitForDisplayed(
        driver,
        byAccessibilityId('user-loginPass-action'),
      );

      await loginButton.click();

      await waitForDisplayed(
        driver,
        byText('User ID is required'),
      );

      await waitForDisplayed(
        driver,
        byText('Password is required'),
      );
    },
  },

  {
    name: 'login with phone and otp',
    fn: async (driver, helpers) => {
      const { waitForDisplayed, byAccessibilityId } = helpers;

      const phoneInput = await waitForDisplayed(
        driver,
        byAccessibilityId('login-Phone-input'),
      );

      await phoneInput.click();
      await phoneInput.setValue('8820260619');

      const sendOtpButton = await waitForDisplayed(
        driver,
        byAccessibilityId('login-Send-OTP'),
      );

      await sendOtpButton.click();

      // Wait for OTP Login button to appear
      const loginOtpButton = await waitForDisplayed(
        driver,
        byAccessibilityId('user-loginOtp-action'),
      );

      // Fill OTP
      const otp1 = await waitForDisplayed(
        driver,
        byAccessibilityId('otp-input-0'),
      );
      await otp1.setValue('1');

      const otp2 = await waitForDisplayed(
        driver,
        byAccessibilityId('otp-input-1'),
      );
      await otp2.setValue('1');

      const otp3 = await waitForDisplayed(
        driver,
        byAccessibilityId('otp-input-2'),
      );
      await otp3.setValue('1');

      const otp4 = await waitForDisplayed(
        driver,
        byAccessibilityId('otp-input-3'),
      );
      await otp4.setValue('1');

      const otp5 = await waitForDisplayed(
        driver,
        byAccessibilityId('otp-input-4'),
      );
      await otp5.setValue('1');

      await loginOtpButton.click();
    },
  }
];

module.exports = loginTests;