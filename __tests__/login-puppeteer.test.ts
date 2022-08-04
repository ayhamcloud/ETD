import puppeteer from 'puppeteer';

jest.setTimeout(150000)

it('puppeteer home ', async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto('http://localhost:3000/login');

  await page.type('[name="email"]',"login@example.com");
  await page.type('[name="password"]',"#a3456789");
  await page.click('[type="submit"]');
  await page.waitForTimeout(4000);
  await page.waitForSelector('[type="submit"]');
  expect(page.url()).toBe('http://localhost:3000/');
  await browser.close();
})