import { server } from "../config";
import puppeteer from 'puppeteer';

jest.setTimeout(20000)

it('puppeteer home ', async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto(`${server}`)
  await page.waitForSelector('[href="/signup"]');
  await page.click('[href="/signup"]');
  const button = await page.$('[href="/signup"]')
  let buttonBoundingBox = await button?.boundingBox() as any;
  expect(buttonBoundingBox.height * buttonBoundingBox.width).toBeGreaterThanOrEqual(1000)
  await page.waitForNavigation();
  expect(page.url()).toBe(`${server}\signup`);
  await browser.close();
})