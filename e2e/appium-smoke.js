const path = require('path');
const { remote } = require('webdriverio');

const loginTests = require('./tests/login.test');
const onboardingTests = require('./tests/onboarding.test');
const bookingTests = require('./tests/booking.test');

const {
  byAccessibilityId,
  byText,
  waitForDisplayed,
} = require('./helpers');

const appPath =
  process.env.APPIUM_APK_PATH ||
  path.resolve(
    __dirname,
    '../android/app/release/app-release.apk',
  );

const APP_PACKAGE = 'com.ngo_booking';

async function runCase(name, testFn) {
  console.log(`\n▶ Running: ${name}`);
  await testFn();
  console.log(`✅ Passed: ${name}`);
}

async function run() {
  const driver = await remote({
    protocol: process.env.APPIUM_PROTOCOL || 'http',
    hostname: process.env.APPIUM_HOST || '127.0.0.1',
    port: Number(process.env.APPIUM_PORT || 4723),

    // Appium 2.x / 3.x
    path: process.env.APPIUM_BASE_PATH || '/',

    logLevel: 'warn',

    capabilities: {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',

  'appium:deviceName':
    process.env.APPIUM_DEVICE_NAME || 'Android Emulator',

  'appium:app': appPath,
  'appium:appPackage': APP_PACKAGE,
  'appium:appActivity':
    process.env.APPIUM_APP_ACTIVITY || '.MainActivity',

  'appium:appWaitPackage': APP_PACKAGE,
  'appium:appWaitActivity':
    process.env.APPIUM_APP_WAIT_ACTIVITY || '.MainActivity',

  'appium:autoGrantPermissions': true,
  'appium:noReset': true,
  'appium:ignoreHiddenApiPolicyError': true,

  'appium:newCommandTimeout': 30,
  'appium:waitForIdleTimeout': 1000,
}
  });

  try {
    const helpers = {
      byAccessibilityId,
      byText,
      waitForDisplayed,
    };

    const suite = process.argv[2];

    let allTests = [];

    switch (suite) {
      case 'login':
        console.log('\n🚀 Running Login Suite');
        allTests = [...loginTests];
        break;

      case 'onboarding':
        console.log('\n🚀 Running Onboarding Suite');
        allTests = [...onboardingTests];
        break;

      case 'booking':
        console.log('\n🚀 Running Booking Suite');
        allTests = [...bookingTests];
        break;

      default:
        console.log('\n🚀 Running All Smoke Tests');
        allTests = [
          ...loginTests,
          ...onboardingTests,
          ...bookingTests,
        ];
    }

    for (const testCase of allTests) {
      await runCase(
        testCase.name,
        () => testCase.fn(driver, helpers),
      );
    }

    console.log('\n🎉 All selected tests completed successfully');
  } finally {
    await driver.deleteSession();
  }
}

run().catch(error => {
  console.error('\n❌ Test Execution Failed');
  console.error(error);
  process.exit(1);
});





// For GIT HUB


// const path = require('path');
// const {remote} = require('webdriverio');
// const loginTests = require('./tests/login.test');
// const onboardingTests = require('./tests/onboarding.test');
// const bookingTests = require('./tests/booking.test');
// const {byAccessibilityId, byText, waitForDisplayed} = require('./helpers');

// const appPath =
//   process.env.APPIUM_APK_PATH ||
//   path.resolve(
//     __dirname,
//     '../android/app/build/outputs/apk/debug/app-debug.apk',
//   );

// const APP_PACKAGE = 'com.ngo_booking';

// async function runCase(name, testFn) {
//   process.stdout.write(`- ${name}\n`);
//   await testFn();
// }

// async function run() {
//   const driver = await remote({
//     protocol: process.env.APPIUM_PROTOCOL || 'http',
//     hostname: process.env.APPIUM_HOST || '127.0.0.1',
//     port: Number(process.env.APPIUM_PORT || 4723),
//     path: process.env.APPIUM_BASE_PATH || '/wd/hub',
//     logLevel: 'warn',
//     capabilities: {
//       platformName: 'Android',
//       'appium:automationName': 'UiAutomator2',
//       'appium:deviceName': process.env.APPIUM_DEVICE_NAME || 'Android Emulator',
//       'appium:app': appPath,
//       'appium:appPackage': APP_PACKAGE,
//       'appium:appActivity': process.env.APPIUM_APP_ACTIVITY || '.MainActivity',
//       'appium:appWaitPackage': APP_PACKAGE,
//       'appium:appWaitActivity': process.env.APPIUM_APP_WAIT_ACTIVITY || '.MainActivity',
//       'appium:autoGrantPermissions': true,
//       // keep remote commands short so failing tests don't hang
//       'appium:newCommandTimeout': Number(process.env.APPIUM_NEW_COMMAND_TIMEOUT || 30),
//       // reduce Appium idle wait to make startup checks faster
//       'appium:waitForIdleTimeout': Number(process.env.APPIUM_WAIT_IDLE_TIMEOUT || 1000),
//     },
//   });

//   try {
//     const helpers = {
//       byAccessibilityId,
//       byText,
//       waitForDisplayed,
//     };

//     // Combine all test suites
//     const allTests = [
//       ...loginTests,
//       ...onboardingTests,
//       ...bookingTests,
//     ];

//     // Run all tests
//     for (const testCase of allTests) {
//       await runCase(testCase.name, () => testCase.fn(driver, helpers));
//     }
//   } finally {
//     await driver.deleteSession();
//   }
// }

// run().catch(error => {
//   console.error(error);
//   process.exit(1);
// });
