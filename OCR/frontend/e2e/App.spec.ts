import { test, expect } from '@playwright/test';

test('has STLT Name', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Demo STLT')).toBeVisible()
});

test('has new template button', async ({ page , baseURL}) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: '+ New Template' })).toBeVisible()
    await page.getByRole('button', { name: '+ New Template' }).click()
    expect(page.url()).toEqual(`${baseURL}/new-template/upload`)

});

test.describe('when templates exist', async () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/')
        await page.evaluate(() => {
            const templates = [

                {
                    name: "MumpsQuestV1",
                    lab: "Quest",
                    createdBy: "J.Smith",
                    status: "Completed",
                    lastUpdated: new Date(Date.parse("2025-03-24T12:00:00.000-05:00"))
                },
                {
                    name: "LBTIRadar",
                    lab: "Radar",
                    createdBy: "C.Alex",
                    status: "Completed",
                    lastUpdated: new Date(Date.parse("2025-05-30T12:00:00.000-05:00"))
                },
                {
                    name: "COVIDBaylor1",
                    lab: "Emory",
                    createdBy: "A.Bryant",
                    status: "Completed",
                    lastUpdated: new Date(Date.parse("2025-06-21T12:00:00.000-05:00"))
                },
                {
                    name: "COVIDEMory",
                    lab: "Baylor",
                    createdBy: "D.Smith",
                    status: "Completed",
                    lastUpdated: new Date(Date.parse("2024-06-21T12:00:00.000-05:00"))
                },
            ];
            localStorage.setItem('templates', JSON.stringify(templates))
        })
    })
    test('displays list of templates if they exist and sorting functions', async ({page, baseURL}) => {
        await page.goto('/')
        await expect(page.getByRole('heading', { name: 'Saved Templates' })).toBeVisible()
        await expect(page.locator('tbody').getByRole('row')).toHaveCount(4)
        await page.getByText('Updated On').click()
        await expect(page.locator('tbody').locator('tr').nth(0).getByRole('cell').nth(1)).toHaveText('6/21/2024')
        await page.getByText('Updated On').click()
        await expect(page.locator('tbody').locator('tr').nth(0).getByRole('cell').nth(1)).toHaveText('6/21/2025')
        await page.close()

    })
    test('has links to extraction', async ({page, baseURL}) => {
        await page.goto('/')
        await page.getByRole('button', { name: 'Run Data Extraction' }).click()
        expect(page.url()).toEqual(`${baseURL}/extract/upload`)

    })
    test('has links to create new template', async ({page, baseURL}) => {
        await page.goto('/')
        await page.getByRole('button', { name: '+ New Template' }).click()
        expect(page.url()).toEqual(`${baseURL}/new-template/upload`)

    })
})

