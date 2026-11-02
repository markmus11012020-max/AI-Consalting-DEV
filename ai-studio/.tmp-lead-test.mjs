import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("https://aillix.ru/#contact", { waitUntil: "networkidle" });
await page.locator("#lead-name").fill("Тест Aillix");
await page.locator("#lead-contact").fill("@GulnazM1101");
await page.locator("#lead-message").fill("Тестовая заявка после настройки Telegram. Проверка доставки.");
await page.locator("#lead-consent").click();
console.log("consent checked:", await page.locator("#lead-consent").getAttribute("data-state"));
await page.getByRole("button", { name: "Отправить заявку" }).click();
await page.waitForTimeout(9000);
const body = await page.locator("form").innerText().catch(() => "no form");
console.log("FORM TEXT:\n", body.slice(-1200));
console.log("success text count:", await page.getByText("Заявка отправлена").count());
console.log("alerts:", await page.locator("[role=alert]").allTextContents());
await browser.close();
