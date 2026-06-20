const APP_PACKAGE = 'com.ngo_booking';
const APP_START_TIMEOUT = 20000;
const LOGIN_TIMEOUT = 30000;

function androidByText(text) {
  return `android=new UiSelector().text("${text}")`;
}

async function isDisplayed(driver, selector) {
  try {
    return await driver.$(selector).isDisplayed();
  } catch (_error) {
    return false;
  }
}

async function clearAppData(driver) {
  await driver.execute('mobile: clearApp', {appId: APP_PACKAGE});
  await driver.activateApp(APP_PACKAGE);
}

async function continueFromUpdateIfNeeded(driver) {
  if (await isDisplayed(driver, androidByText('Update Later'))) {
    const updateLater = await driver.$(androidByText('Update Later'));
    await updateLater.click();
  }
}

async function waitForUnauthenticatedLogin(driver, helpers) {
  const {waitForDisplayed, byAccessibilityId} = helpers;

  await driver.waitUntil(
    async () => {
      await continueFromUpdateIfNeeded(driver);

      return isDisplayed(driver, byAccessibilityId('login-Phone-input'));
    },
    {
      timeout: LOGIN_TIMEOUT,
      timeoutMsg: 'Expected unauthenticated app flow to land on Login screen',
    },
  );

  await waitForDisplayed(
    driver,
    byAccessibilityId('login-Phone-input'),
  );
  await waitForDisplayed(
    driver,
    byAccessibilityId('login-mode-password'),
  );
}

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
      await driver.waitUntil(
        async () => (await driver.getCurrentPackage()) === APP_PACKAGE,
        {
          timeout: APP_START_TIMEOUT,
          timeoutMsg: `Expected ${APP_PACKAGE} to be the current package`,
        },
      );

      const packageName = await driver.getCurrentPackage();
      if (packageName !== APP_PACKAGE) {
        throw new Error(`Expected ${APP_PACKAGE}, received ${packageName}`);
      }
    },
  },

  {
    name: 'routes unauthenticated users from splash to login',
    fn: async (driver, helpers) => {
      const { waitForDisplayed, byAccessibilityId } = helpers;

      await clearAppData(driver);
      await waitForUnauthenticatedLogin(driver, helpers);
      await switchToOtpMode(driver, helpers);

      await waitForDisplayed(
        driver,
        byAccessibilityId('login-Send-OTP'),
      );
    },
  },

  {
    name: 'validates empty OTP login form',
    fn: async (driver, helpers) => {
      const { waitForDisplayed, byAccessibilityId, byText } = helpers;

      await waitForUnauthenticatedLogin(driver, helpers);
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

      await waitForUnauthenticatedLogin(driver, helpers);
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
    name: 'logs in with phone and otp',
    fn: async (driver, helpers) => {
      const { waitForDisplayed, byAccessibilityId } = helpers;

      await waitForUnauthenticatedLogin(driver, helpers);
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
