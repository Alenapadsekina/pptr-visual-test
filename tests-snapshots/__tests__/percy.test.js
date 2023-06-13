const puppeteer = require("puppeteer");
const percySnapshot = require("@percy/puppeteer");

describe("Percy visual test", () => {
  let browser;
  let page;
  beforeAll(async function () {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });
  afterAll(async function () {
    await browser.close();
  });
  test("Full page Percy snapshot", async function () {
    await page.goto("https://www.example.com");
    await page.waitForSelector("div");
    await page.evaluate(() => {
      (document.querySelectorAll("h1") || []).forEach((el) => el.remove());
    });
    await page.waitForTimeout(5000);
    await percySnapshot(page, "Example Page");
  });
});
