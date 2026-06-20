const APP_PACKAGE = 'com.ngo_booking';

async function switchToOtpMode(driver, helpers) {
  const {waitForDisplayed, byAccessibilityId} = helpers;
  const otpMode = await waitForDisplayed(
    driver,
    byAccessibilityId('login-mode-otp'),
  );

  await otpMode.click();
}

async function switchToPasswordMode(driver, helpers) {
  const {waitForDisplayed, byAccessibilityId} = helpers;
  const passwordMode = await waitForDisplayed(
    driver,
    byAccessibilityId('login-mode-password'),
  );

  await passwordMode.click();
}

async function fillOtp(driver, otp) {
  await driver.waitUntil(
    async () => {
      const inputs = await driver.$$(
        'android=new UiSelector().className("android.widget.EditText")',
      );

      return inputs.length >= otp.length + 1;
    },
    {
      timeout: Number(process.env.E2E_WAIT_TIMEOUT || 5000),
      timeoutMsg: 'Expected phone input plus OTP inputs to be displayed',
    },
  );

  const inputs = await driver.$$(
    'android=new UiSelector().className("android.widget.EditText")',
  );
  const otpInputs = inputs.slice(-otp.length);

  for (let index = 0; index < otp.length; index += 1) {
    await otpInputs[index].click();
    await otpInputs[index].setValue(otp[index]);
  }
}

const loginTests = [
  {
    name: 'launches the NGO Booking package',
    fn: async (driver) => {
      const packageName = await driver.getCurrentPackage();

      if (packageName !== APP_PACKAGE) {
        throw new Error(`Expected ${APP_PACKAGE}, received ${packageName}`);
      }
    },
  },

  {
    name: 'shows the login screen after splash',
    fn: async (driver, helpers) => {
      const { waitForDisplayed, byAccessibilityId } = helpers;

      await switchToOtpMode(driver, helpers);

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

      await switchToOtpMode(driver, helpers);

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

      await switchToPasswordMode(driver, helpers);

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

      await switchToOtpMode(driver, helpers);

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

      const loginOtpButton = await waitForDisplayed(
        driver,
        byAccessibilityId('user-loginOtp-action'),
      );

      await fillOtp(driver, '11111');

      await loginOtpButton.click();
    },
  },
];

module.exports = loginTests;
