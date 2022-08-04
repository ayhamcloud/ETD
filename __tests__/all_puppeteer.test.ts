import puppeteer from "puppeteer";

jest.setTimeout(100000);
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

async function get(page, ueb) {
  await page.waitForTimeout(1000);
  await page.type('[name="name"]', `Uebung ${ueb + random(1, 100)}`);
  await page.waitForTimeout(1500);
  for (let i = 0; i < 5; i++) {
    await page.type(`[name="sets[${i}].weight"]`, (50 + i * 5).toString());
    await page.type(`[name="sets[${i}].reps"]`, (10 + i).toString());
    await page.waitForTimeout(300);
    await page.click(
      `#__next > div > div.MuiBox-root.css-156anjs > div > div:nth-child(1) > div > div.MuiCollapse-root.MuiCollapse-vertical.MuiCollapse-entered.css-pwcg7p-MuiCollapse-root > div > div > div > main > div > form > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.css-kulz2l-MuiGrid-root > div:nth-child(${
        i + 1
      }) > div:nth-child(4) > button`
    );
  }
  await page.waitForTimeout(1000);
  await page.click(
    "#__next > div > div.MuiBox-root.css-156anjs > div > div:nth-child(1) > div > div.MuiCollapse-root.MuiCollapse-vertical.MuiCollapse-entered.css-pwcg7p-MuiCollapse-root > div > div > div > main > div > form > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.css-kulz2l-MuiGrid-root > div:nth-child(6) > div:nth-child(3) > button"
  );
  await page.waitForTimeout(1000);
  await page.click('[type="submit"]');
  await page.waitForTimeout(1000);
}

it("puppeteer login2end", async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("http://localhost:3000/login");
  await page.waitForSelector(
    "#__next > main > div.MuiBox-root.css-1kjaip3 > form > button"
  );
  await page.type('[name="email"]', "login@example.com");
  await page.type('[name="password"]', "#a3456789");
  await page.click('[type="submit"]');
  await page.waitForNavigation();
  await page.waitForTimeout(1000);
  await page.click(
    "#__next > div > a.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary.MuiButton-sizeLarge.MuiButton-outlinedSizeLarge.css-1d1wy9s-MuiButtonBase-root-MuiButton-root"
  );
  await page.waitForNavigation();
  await page.waitForTimeout(1000);
  await page.click("#__next > div > nav > a:nth-child(3)");
  await page.waitForNavigation();
  await page.waitForTimeout(1000);
  await page.type('[name="session_training"]', "Ein Workout von pptr");
  await page.click('[type="submit"]');
  await page.waitForNavigation();
  await get(page, 1);
  await page.waitForTimeout(1500);
  await page.click(
    "#__next > div > div.MuiBox-root.css-156anjs > div > div:nth-child(1) > div > div.MuiCardActions-root.css-1rwjz6-MuiCardActions-root > button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary.MuiButton-sizeMedium.MuiButton-outlinedSizeMedium.css-1jl194c-MuiButtonBase-root-MuiButton-root"
  );
  await get(page, 2);

  const id = page.url().split("?id=")[1];

  await page.waitForTimeout(2000);

  await page.click('[href="/sessions"]');
  await page.waitForNavigation();
  await page.waitForTimeout(1000);
  await page.click(`[href="/sessions/${id}"]`);
  await page.waitForNavigation();
  await page.waitForTimeout(4000);
  expect(page.url()).toContain(`sessions/${id}`);
});
