import puppeteer from 'puppeteer';
import { PrismaClient } from "@prisma/client";

jest.setTimeout(100000)

it('puppeteer home ', async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto('http://localhost:3000/signup');

  const prisma = new PrismaClient();
  try {
    await prisma.user.delete({
      where: {
        email: "signup1@gmail.com"
      }
    })
  }
  catch (err) {
  }

  prisma.$disconnect()

  await page.type('[name="name"]',"signup1");
  await page.type('[name="email"]',"signup1@gmail.com");
  await page.type('[name="password"]',"#a3456789");
  await page.click('[type="submit"]');
  await page.waitForNavigation();
  await page.waitForTimeout(1000);
  expect(page.url()).toBe('http://localhost:3000/verification/check-email');
  await browser.close();
})