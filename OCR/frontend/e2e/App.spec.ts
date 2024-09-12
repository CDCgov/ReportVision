import { test, expect } from '@playwright/test';
import {Simulate} from "react-dom/test-utils";
import click = Simulate.click;

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
