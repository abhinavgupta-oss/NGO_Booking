const path = require('path');
const {remote} = require('webdriverio');

const appPath =
  process.env.APPIUM_APK_PATH ||
  path.resolve(
    __dirname,
    '../android/app/build/outputs/apk/debug/app-debug.apk',
  );

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
      'appium:appPackage': 'com.ngo_booking',
      'appium:appActivity': '.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 60,
    },
  });

  try {
    const packageName = await driver.getCurrentPackage();

    if (packageName !== 'com.ngo_booking') {
      throw new Error(`Expected com.ngo_booking, received ${packageName}`);
    }
  } finally {
    await driver.deleteSession();
  }
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
