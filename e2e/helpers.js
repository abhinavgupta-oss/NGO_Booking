function byAccessibilityId(id) {
  return `~${id}`;
}

function byText(text) {
  return `android=new UiSelector().text("${text}")`;
}

const DEFAULT_WAIT_TIMEOUT = Number(process.env.E2E_WAIT_TIMEOUT || 5000);

async function waitForDisplayed(driver, selector, timeout = DEFAULT_WAIT_TIMEOUT) {
  const element = await driver.$(selector);
  await element.waitForDisplayed({timeout});
  return element;
}

module.exports = {
  byAccessibilityId,
  byText,
  waitForDisplayed,
  DEFAULT_WAIT_TIMEOUT,
};
