import puppeteer from "puppeteer";

jest.setTimeout(100000);
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

async function get(page, ueb) {
  await page.waitForTimeout(4000);
  await page.type('[name="name"]', `Uebung ${ueb + random(1, 100)}`);
  await page.waitForTimeout(1500);
  for (let i = 0; i < 5; i++) {
    await page.type(`[name="sets[${i}].weight"]`, (50 + i * 5).toString());
    await page.type(`[name="sets[${i}].reps"]`, (10 + i).toString());
    await page.waitForTimeout(300);
    await page.click(`[id='AddSet${i}']`);
  }
  await page.waitForTimeout(4000);
  await page.click("[aria-label='DelteSet5']");
  await page.waitForTimeout(4000);
  await page.click('[id="Save"]');
  await page.waitForTimeout(4000);
}

it("puppeteer login2end", async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("http://localhost:3000/login");
  await page.waitForSelector('[type="submit"]');
  await page.type('[name="email"]', "login@example.com");
  await page.type('[name="password"]', "#a3456789");
  await page.click('[type="submit"]');
  await page.waitForTimeout(4000);
  await page.click('[type="submit"]');
  await page.waitForTimeout(4000);
  await page.click('[href="/sessions/new"]');
  await page.waitForTimeout(4000);
  await page.type('[name="session_training"]', "Ein Workout von pptr");
  await page.click('[type="submit"]');
  await get(page, 1);
  await page.waitForTimeout(1500);
  await page.click("#AddExercise");
  await get(page, 2);

  const id = page.url().split("?id=")[1];

  await page.waitForTimeout(4000);

  await page.click('[href="/sessions"]');
  await page.waitForNavigation();
  await page.waitForTimeout(1000);
  await page.click(`[href="/sessions/${id}"]`);
  await page.waitForNavigation();
  await page.waitForTimeout(4000);
  expect(page.url()).toContain(`sessions/${id}`);
});
