import { test, expect } from "@playwright/test";

test.describe("ReviewTemplate Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the ReviewTemplate page
    await page.goto("http://localhost:5173/extract/review");
  });

  test("Document image scrollable", async ({ page }) => {
    // Check if the document is scrollable
    const scrollContainer = page.locator("div[style*='overflow-y: auto']");
    const beforeScroll = await scrollContainer.evaluate((el) => el.scrollTop);

    await scrollContainer.evaluate((el) => el.scrollBy(0, 100));
    const afterScroll = await scrollContainer.evaluate((el) => el.scrollTop);

    expect(afterScroll).toBeGreaterThan(beforeScroll);
  });

  // Test the Back button functionality
  test("Back button navigates correctly", async ({ page }) => {
    const backButton = page.getByRole("button", { name: "Back" });
    await expect(backButton).toBeVisible();

    await backButton.click();
    await expect(page).toHaveURL("/extract/upload");
  });

  // Test the Submit button functionality
  test("Submit button navigates correctly", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: "Submit" });
    await expect(submitButton).toBeVisible();

    await submitButton.click();
    await expect(page).toHaveURL("/extract/submit");
  });

  // Test the extracted data section
  test("Displays extracted data with overall confidence score", async ({
    page,
  }) => {
    const extractedDataHeader = page.getByRole("heading", {
      name: "Extracted Data",
    });
    await expect(extractedDataHeader).toBeVisible();

    await expect(page.locator("p.font-sans")).toHaveText(
      "Review and edit errors before you submit."
    );
  });

  test("Table contains the correct headers", async ({ page }) => {
    const headers = page.locator("th");
    await expect(headers.nth(0)).toHaveText("Label"); // First header
    await expect(headers.nth(1)).toHaveText("Value"); // Second header
    await expect(headers.nth(2)).toHaveText("Label Confidence"); // Third header
  });
});
