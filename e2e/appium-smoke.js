const path = require('path');
const {remote} = require('webdriverio');

const appPath =
  process.env.APPIUM_APK_PATH ||
  path.resolve(
    __dirname,
    '../android/app/build/outputs/apk/debug/app-debug.apk',
  );

const APP_PACKAGE = 'com.ngo_booking';

function byAccessibilityId(id) {
  return `~${id}`;
}

function byText(text) {
  return `android=new UiSelector().text("${text}")`;
}

async function waitForDisplayed(driver, selector, timeout = 10000) {
  const element = await driver.$(selector);
  await element.waitForDisplayed({timeout});
  return element;
}

async function runCase(name, testFn) {
  process.stdout.write(`- ${name}\n`);
  await testFn();
}

async function run() {
  const driver = await remote({
    protocol: process.env.APPIUM_PROTOCOL || 'http',
    hostname: process.env.APPIUM_HOST || '127.0.0.1',
    port: Number(process.env.APPIUM_PORT || 4723),
    path: process.env.APPIUM_BASE_PATH || '/wd/hub',
    logLevel: 'warn',
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.APPIUM_DEVICE_NAME || 'Android Emulator',
      'appium:app': appPath,
      'appium:appPackage': APP_PACKAGE,
      'appium:appActivity': '.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 60,
    },
  });

  try {
    await runCase('launches the NGO Booking package', async () => {
      const packageName = await driver.getCurrentPackage();

      if (packageName !== APP_PACKAGE) {
        throw new Error(`Expected ${APP_PACKAGE}, received ${packageName}`);
      }
    });

    await runCase('shows the login screen after splash', async () => {
      await waitForDisplayed(
        driver,
        byAccessibilityId('login-user-id-input'),
        15000,
      );
      await waitForDisplayed(driver, byAccessibilityId('login-send-otp-button'));
      await waitForDisplayed(driver, byAccessibilityId('login-mode-password'));
    });

    await runCase('validates empty OTP login form', async () => {
      const sendOtpButton = await waitForDisplayed(
        driver,
        byAccessibilityId('login-send-otp-button'),
      );

      await sendOtpButton.click();
      await waitForDisplayed(driver, byText('Phone number is required'));
    });

    await runCase('validates empty password login form', async () => {
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
    });
  } finally {
    await driver.deleteSession();
  }
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
