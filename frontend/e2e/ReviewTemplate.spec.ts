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

  // Test the extracted data section
  test("Displays extracted data with overall confidence score", async ({
    page,
  }) => {
    const extractedDataHeader = page.getByRole("heading", {
      name: "Data Validation",
    });
    await expect(extractedDataHeader).toBeVisible();

    await expect(page.locator("p")).toHaveText(
      "Here is your batch export. Please review all forms and correct any items with a low confidence score (CS) before downloading.",
    );
  });

  test("Table contains the correct headers", async ({ page }) => {
    const headers = page.locator("th");
    await expect(headers.nth(0)).toHaveText("Name"); // First header
    await expect(headers.nth(1)).toHaveText("Page Count"); // Second header
    await expect(headers.nth(2)).toHaveText("Errors"); // Third header
    await expect(headers.nth(3)).toHaveText("CS"); // Fourth header
  });

  test("should calculate overall confidence score correctly", async ({
    page,
  }) => {
    // Check that the overall confidence score is calculated correctly
    const overallConfidence = await page.locator("td");
    await expect(overallConfidence.nth(3)).toContainText("72.08");
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
    const DrawLocation = page.locator("tr .error-text");
    await expect(DrawLocation.nth(3)).toHaveClass(/error-text/);
  });

  test("should click into single table view", async ({ page }) => {
    const DrawLocation = page.locator("tr .error-text");
    await DrawLocation.nth(3).click();

    const extractedDataHeader = page.getByRole("heading", {
      name: "Extracted Data",
    });
    await expect(extractedDataHeader).toBeVisible();

    await expect(page.locator("p")).toHaveText(
      "Review and edit errors before you submit.",
    );
  });

  test("should handle error fixes", async ({ page }) => {
    const DrawLocation = page.locator("tr .error-text");
    await DrawLocation.nth(3).click();
    const submitButton = page.getByRole("button", { name: "Done" });

    const errorRows = await page.locator("tr *[data-testid='edit-fix-error']");
    await expect(submitButton).toBeDisabled();
    for (const row of await errorRows.elementHandles()) {
      await row.click();
      await page.keyboard.press("Enter");
    }
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    const extractedDataHeader = page.getByRole("heading", {
      name: "Data Validation",
    });
    await expect(extractedDataHeader).toBeVisible();

    const nextError = page.locator("tr .error-text");
    await nextError.nth(3).click();
    await expect(submitButton).toBeDisabled();
    for (const row of await errorRows.elementHandles()) {
      await row.click();
      await page.keyboard.press("Enter");
    }

    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    await nextError.nth(3).click();
    await expect(submitButton).toBeDisabled();
    for (const row of await errorRows.elementHandles()) {
      await row.click();
      await page.keyboard.press("Enter");
    }

    const finalSubmitButton = page.getByRole("button", { name: "Download CSV" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await finalSubmitButton.click();
    await expect(page).toHaveURL("/");
  });
});
