import puppeteer from 'puppeteer';
import { PrismaClient } from "@prisma/client";

jest.setTimeout(20000)

it('puppeteer home ', async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto('http://localhost:3000/login');

  await page.type('[name="email"]',"login@gmail.com");
  await page.type('[name="password"]',"#a3456789");
  await page.click('[type="submit"]');
  await page.waitForNavigation();
  expect(page.url()).toBe('http://localhost:3000/sessions');
  await browser.close();
})