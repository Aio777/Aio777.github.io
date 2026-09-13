import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('all six case studies are reachable and the CV is a PDF', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/work/');
  const links = await page.locator('.project-card a').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
  expect(links).toHaveLength(6);
  for (const link of links) {
    await page.goto(link!);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('.limitations')).toBeVisible();
    expect(await page.locator('body').innerText()).not.toContain('239×');
  }
  const pdf = await request.get('/cv/aryan-lokesh-cv.pdf');
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');
  expect(errors).toEqual([]);
});

test('filters show exactly the selected discipline', async ({ page }) => {
  await page.goto('/work/');
  for (const filter of ['Software', 'Applied AI', 'Systems']) {
    await page.getByRole('button', { name: filter, exact: true }).click();
    await expect(page.locator('[data-project-category]:visible')).toHaveCount(2);
    await expect(page.locator('.filter-count')).toHaveText('02 PROJECTS');
  }
  await page.getByRole('button', { name: 'All work' }).click();
  await expect(page.locator('[data-project-category]:visible')).toHaveCount(6);
});

test('benchmark comparisons include the CPU-faster result', async ({ page }) => {
  await page.goto('/work/parallel-computing/');
  await page.getByRole('button', { name: 'Histogram', exact: true }).click();
  await expect(page.locator('[data-baseline-label]')).toHaveText('OpenMP');
  await expect(page.locator('[data-baseline-time]')).toHaveText('0.671 ms');
  await expect(page.locator('[data-comparison]')).toHaveText('OpenMP: 0.671 ms · CUDA: 2.606 ms.');
  await page.getByRole('button', { name: 'Emboss', exact: true }).click();
  await expect(page.locator('[data-cuda-time]')).toHaveText('2.512 ms');
});

test('project cards foreground scope and the revised project visuals', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.getByRole('heading', { name: 'Selected projects.' })).toBeVisible();
  await expect(page.locator('.project-card-facts')).toHaveCount(6);
  await expect(page.locator('.art-parallel-computing')).toContainText('COUNT GLIDERS');
  await expect(page.locator('.art-parallel-computing')).toContainText('HISTOGRAM');
  await expect(page.locator('.art-parallel-computing')).toContainText('EMBOSS');
  await expect(page.locator('.art-parallel-computing')).not.toContainText('239');
  await expect(page.locator('.art-productiv')).toContainText('ILLUSTRATIVE ARCHITECTURE');
});

test('site copy avoids generic slogans on the main pages', async ({ page }) => {
  for (const route of ['/', '/work/', '/about/']) {
    await page.goto(route);
    const copy = await page.locator('body').innerText();
    expect(copy).not.toContain('THERE’S MORE TO THE STORY');
    expect(copy).not.toContain('Talk to me about');
    expect(copy).not.toContain('I build software.');
    expect(copy).not.toContain('I measure it too.');
  }
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Software engineer. Applications, models, systems.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Contact.' })).toBeVisible();
});

test('Heston case study explains the dissertation and retained run', async ({ page }) => {
  await page.goto('/work/heston/');
  await expect(page.getByRole('heading', { name: 'Heston pricing and calibration.' })).toBeVisible();
  await expect(page.locator('main')).toContainText('Individual dissertation');
  await expect(page.locator('main')).toContainText('600,000 synthetic samples');
  await expect(page.locator('main')).toContainText('93 filtered out-of-the-money SPX contracts');
  await expect(page.locator('main')).toContainText('4.92 s');
  await expect(page.locator('main')).toContainText('2.52 s');
  await expect(page.locator('main')).toContainText('0.40 s');
  await expect(page.locator('main')).toContainText('not independently reproduced');
});

test('theme and motion preferences survive client navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.locator('.motion-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.locator('.desktop-nav').getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('main h1').first()).toBeVisible();
});

test('mobile navigation and page widths work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden();
  for (const route of ['/', '/work/', '/about/', '/cv/', '/work/parallel-computing/', '/work/tb-screening/']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  }
});

test('key pages pass automated accessibility checks in both themes', async ({ page }) => {
  for (const route of ['/', '/work/', '/about/', '/cv/', '/work/parallel-computing/']) {
    await page.goto(route);
    for (const theme of ['dark', 'light']) {
      await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations, `${route} ${theme}: ${JSON.stringify(results.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })))}`).toEqual([]);
    }
  }
});
