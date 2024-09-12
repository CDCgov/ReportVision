import { test, expect } from '@playwright/test';
import {Simulate} from "react-dom/test-utils";
import click = Simulate.click;

test('has STLT Name', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await expect(page.getByText('Demo STLT')).toBeVisible()
});

test('has new template button', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('button', { name: '+ New Template' })).toBeVisible()
    await page.getByRole('button', { name: '+ New Template' }).click()
    expect(page.url()).toEqual("http://localhost:5173/new-template/upload")
});
