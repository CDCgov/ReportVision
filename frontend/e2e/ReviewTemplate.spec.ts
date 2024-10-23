import { test, expect } from "@playwright/test";

test.describe("ReviewTemplate Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the ReviewTemplate page
    await page.goto("/extract/review");
  });

  // Test the Back button functionality
  test("Back button navigates correctly", async ({ page }) => {
    const backButton = page.getByRole("button", { name: "Back" });
    await expect(backButton).toBeVisible();

    await backButton.click();
    await expect(page).toHaveURL("/extract/upload");
  });

  // Test the Done button functionality
  test("Done button navigates correctly", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: "Done" });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled();
    const errorRows = await page.locator("tr *[data-testid='edit-fix-error']");
    for (const row of await errorRows.elementHandles()) {
      await row.click();
      await page.keyboard.press('Enter');
    }

    await submitButton.click();
    await expect(page).toHaveURL("/");
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
    await expect(headers.nth(3)).toHaveText("Label CS"); // Third header
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
    const errorCount = await page.locator("tr .error-text").count();

    await expect(errorCount).toBeGreaterThan(0);
  });

  test("should apply error styling when confidence is below threshold", async ({
    page,
  }) => {
    const DrawLocation = page.locator("td >> text=BH_1Diamondd_LAB");
    await expect(DrawLocation).toHaveClass(/error-text/);
  });
});
