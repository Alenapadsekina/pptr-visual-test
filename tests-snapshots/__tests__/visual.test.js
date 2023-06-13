const puppeteer = require("puppeteer");
const { toMatchImageSnapshot } = require("jest-image-snapshot");
expect.extend({ toMatchImageSnapshot });

describe("Visual regression testing", () => {
  let browser;
  let page;
  beforeAll(async function () {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });
  afterAll(async function () {
    await browser.close();
  });
  test("Full page snapshot", async function () {
    await page.goto("https://www.example.com");
    await page.waitForSelector("h1");
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThresholdType: "pixel",
      failureThreshold: 300,
    });
  });
  test("Single element snapshot", async function () {
    await page.goto("https://www.example.com");
    const h1 = await page.waitForSelector("h1");
    const image = await h1.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThresholdType: "percent",
      failureThreshold: 0.1,
    });
  });
  test("Mobile snapshot", async function () {
    await page.goto("https://www.example.com");
    await page.waitForSelector("h1");
    await page.emulate(puppeteer.devices["iPhone X"]);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThresholdType: "pixel",
      failureThreshold: 300,
    });
  });
  test("Remove element before snapshot", async function () {
    await page.goto("https://www.example.com");
    await page.evaluate(() => {
      (document.querySelectorAll("h1") || []).forEach((el) => el.remove());
    });
    await page.waitForTimeout(5000);

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThresholdType: "pixel",
      failureThreshold: 300,
    });
  });
});
