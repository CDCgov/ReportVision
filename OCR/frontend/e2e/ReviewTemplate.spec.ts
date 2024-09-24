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
    await expect(headers.nth(3)).toHaveText("Label Confidence"); // Third header
  });

  test("should calculate overall confidence score correctly", async ({
    page,
  }) => {
    // Check that the overall confidence score is calculated correctly
    const overallConfidence = await page.locator("span.text-black");
    await expect(overallConfidence).toContainText("83.67%");
  });

  test("should correctly identify and count errors (below threshold)", async ({
    page,
  }) => {
    const errorCount = await page.locator("tr .usa-input--error").count();

    await expect(errorCount).toBeGreaterThan(0);
  });

  test("should apply error styling when confidence is below threshold", async ({
    page,
  }) => {
    const DrawLocation = page.locator("td >> text=BH_1Diamondd_LAB");
    await expect(DrawLocation).toHaveClass(/usa-input--error/);
  });
});
