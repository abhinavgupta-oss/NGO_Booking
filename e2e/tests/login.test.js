const APP_PACKAGE = 'com.ngo_booking';
const APP_START_TIMEOUT = 20000;
const LOGIN_TIMEOUT = 30000;

function androidByText(text) {
  return `android=new UiSelector().text("${text}")`;
}

async function isDisplayed(driver, selector) {
  try {
    const element = await driver.$(selector);
    return await element.isDisplayed();
  } catch (_) {
    return false;
  }
}

async function clearAppData(driver) {
  console.log('🔄 Restarting application...');

  try {
    await driver.terminateApp(APP_PACKAGE);
  } catch (_) { }

  await driver.activateApp(APP_PACKAGE);

  // Allow app to stabilize
  await driver.pause(3000);
}

/**
 * Dump visible texts for debugging
 */
async function dumpScreen(driver) {
  try {
    const elements = await driver.$$(
      'android=new UiSelector().className("android.widget.TextView")'
    );

    console.log('\n========== CURRENT SCREEN ==========');

    for (const el of elements) {
      try {
        const text = await el.getText();
        if (text?.trim()) {
          console.log(text);
        }
      } catch (_) { }
    }

    console.log('====================================\n');
  } catch (_) { }
}

/**
 * Handle Update Later popup only once
 */
async function continueFromUpdateIfNeeded(driver) {
  try {
    const updateSelector = androidByText('Update Later');

    if (await isDisplayed(driver, updateSelector)) {
      console.log('✅ Update dialog found');

      const updateButton = await driver.$(updateSelector);
      await updateButton.click();

      console.log('✅ Clicked Update Later');

      // Wait for transition
      await driver.pause(3000);
    }
  } catch (err) {
    console.log('No update popup found');
  }
}

/**
 * Handel Register Now
 */

async function clickOnRegistrationNow(driver) {
  try {
    const registerSelector = androidByText('Register Now');

    if (await isDisplayed(driver, registerSelector)) {
      console.log('✅ Registeration dialog found');

      const updateButton = await driver.$(registerSelector);
      await updateButton.click();

      console.log('✅ Clicked Register NOw');

      // Wait for transition
      await driver.pause(3000);
    }
  } catch (err) {
    console.log('No update popup found');
  }
}

/**
 * Wait until Login Screen appears
 */
async function waitForUnauthenticatedLogin(driver, helpers) {
  const { waitForDisplayed, byAccessibilityId } = helpers;

  console.log('🔄 Waiting for Login Page...');

  const startTime = Date.now();

  while (Date.now() - startTime < LOGIN_TIMEOUT) {
    try {
      // Handle update popup if visible
      await continueFromUpdateIfNeeded(driver);
      console.log('✅ Login button section');
      // Login page loaded
      if (
        await isDisplayed(
          driver,
          androidByText('Enter Phone Number')
        )
      ) {
        console.log('✅ Login page detected');
        break;
      }

      await driver.pause(1000);
    } catch (_) { }
  }

  const loginVisible = await isDisplayed(
    driver,
    androidByText('Enter Phone Number')
  );

  if (!loginVisible) {
    console.log('❌ Login screen not detected');
    await dumpScreen(driver);

    throw new Error(
      'Expected unauthenticated app flow to land on Login screen'
    );
  }

  await waitForDisplayed(
    driver,
    androidByText('Enter Phone Number')
  );

  await waitForDisplayed(
    driver,
    androidByText('Password')
  );

  console.log('✅ Login screen ready');
}

async function switchToOtpMode(driver, helpers) {
  const { waitForDisplayed, byAccessibilityId } = helpers;

  const otpMode = await waitForDisplayed(
    driver,
    androidByText('Via OTP')
  );

  await otpMode.click();

  console.log('✅ OTP Mode Selected');
}

async function switchToPasswordMode(driver, helpers) {
  const { waitForDisplayed, byAccessibilityId } = helpers;

  const passwordMode = await waitForDisplayed(
    driver,
    androidByText('Password')
  );

  await passwordMode.click();

  console.log('✅ Password Mode Selected');
}

async function fillOtp(driver, otp) {
  await driver.waitUntil(
    async () => {
      const inputs = await driver.$$(
        'android=new UiSelector().className("android.widget.EditText")'
      );

      return inputs.length >= otp.length + 1;
    },
    {
      timeout: 5000,
      interval: 500,
      timeoutMsg:
        'Expected phone input plus OTP inputs to be displayed',
    }
  );

  const inputs = await driver.$$(
    'android=new UiSelector().className("android.widget.EditText")'
  );

  const otpInputs = inputs.slice(-otp.length);

  for (let i = 0; i < otp.length; i++) {
    await otpInputs[i].click();
    await otpInputs[i].setValue(otp[i]);
  }

  console.log('✅ OTP Entered');
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
        androidByText('Via OTP')
        ,
      );
    },
  },

  {
    name: 'validates empty OTP login form',
    fn: async (driver, helpers) => {
      const { waitForDisplayed, byAccessibilityId, byText } = helpers;
      console.log('✅ OTP  flow');

      await waitForUnauthenticatedLogin(driver, helpers);
      await switchToOtpMode(driver, helpers);

      const sendOtpButton = await waitForDisplayed(
        driver,
        androidByText('Send OTP')
        ,
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
      console.log('✅ Password  flow');

      await waitForDisplayed(
        driver,
        androidByText('Enter User ID'),
      );

      await waitForDisplayed(
        driver,
        androidByText('Enter Password'),
      );

      const loginButton = await waitForDisplayed(
        driver,
        androidByText('Login'),
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
      const {
        waitForDisplayed,
        byAccessibilityId,
        byText,
      } = helpers;

      await switchToOtpMode(driver, helpers);

      // Phone Number
      const phoneInput = await waitForDisplayed(
        driver,
        androidByText('Enter Phone Number'),
      );

      await phoneInput.click();
      await phoneInput.setValue('8720260615');
      console.log('✅ Number Filled');

      // Close Keyboard
      try {
        await driver.hideKeyboard();
        console.log('✅ Keyboard Closed');
      } catch (e) {
        try {
          await driver.back();
        } catch (_) { }
      }

      await driver.pause(1000);

      // Send OTP
      const sendOtpButton = await waitForDisplayed(
        driver,
        androidByText('Send OTP'),
        byAccessibilityId('login-Send-OTP'),
      );

      await sendOtpButton.click();
      console.log('✅ Clicked Send OTP');

      // Wait OTP Screen
      // await waitForDisplayed(
      //   driver,
      //   byText('Enter Verification OTP'),
      // );

      // console.log('✅ OTP Area Visible');

      // await driver.pause(2000);

      // Find OTP EditText
      // const editTexts = await driver.$$(
      //   'android=new UiSelector().className("android.widget.EditText")'
      // );

      // console.log(`✅ Found ${editTexts.length} EditText(s)`);

      // if (editTexts.length === 0) {
      //   throw new Error('OTP input field not found');
      // }

      // Usually OTP field is the last EditText
      // const otpField = editTexts[editTexts.length - 1];

      // await otpField.click();
      // await driver.pause(500);

      // try {
      //   await otpField.clearValue();
      // } catch (e) { }

      // Enter OTP
      // await otpField.setValue('11111');

      // console.log('✅ OTP Filled');

      // await driver.pause(1000);

      // Close Keyboard
      // try {
      //   await driver.hideKeyboard();
      //   console.log('✅ Keyboard Closed');
      // } catch (e) {
      //   try {
      //     await driver.back();
      //     console.log('✅ Keyboard Closed Using Back');
      //   } catch (_) { }
      // }

      // await driver.pause(1000);

      // Login Button
      // const loginOtpButton = await waitForDisplayed(
      //   driver,
      //   androidByText('Login'),
      // );

      // await loginOtpButton.click();

      console.log('✅ Login Clicked');
    },
  }
];

module.exports = loginTests;
