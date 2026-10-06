// Optional browser verification. See README.md for dependency setup.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
let chromium, AxeBuilder;
try {
  ({chromium} = await import('playwright'));
  ({default:AxeBuilder} = await import('@axe-core/playwright'));
} catch {
  console.error('Browser QA dependencies are unavailable. See README.md → Browser verification. No browser checks were run.');
  process.exit(1);
}
const browser = await chromium.launch({...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
const url = process.env.QA_URL || 'http://localhost:3000';
const results = [];
await mkdir('qa',{recursive:true});
try {
  for (const width of [320,360,390,768,1440]) {
    const context = await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error=>errors.push(error.message));
    page.on('console', message=>{if (message.type()==='error') errors.push(message.text());});
    page.on('response', response=>{if (response.url().startsWith(url) && response.status()>=400) errors.push(`${response.status()} ${response.url()}`);});
    await page.goto(url,{waitUntil:'networkidle'});
    assert.equal(await page.locator('h1').count(),1);
    await page.waitForFunction(() => document.querySelector('.site-header')?.classList.contains('enhanced'));
    const bookingLinks = await page.locator('a[href*="calendly.com"]').count();
    assert(bookingLinks >= 3, 'Booking actions missing');
    const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > document.documentElement.clientWidth+1);
    assert(!overflow,`Horizontal overflow at ${width}px`);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(),'Skip to content');
    if (width<=900) {
      const menu = page.getByRole('button',{name:/Menu/});
      await menu.click();
      assert.equal(await menu.getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'),'false');
      assert.equal(await page.locator(':focus').getAttribute('aria-controls'),'navigation');
    }
    await page.screenshot({path:`qa/${width}-page.png`,fullPage:true});
    for (const sample of ['landing','email','vsl']) {
      const details = page.locator(`#sample-${sample} details`);
      await details.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert(await details.getAttribute('open') !== null);
      assert(await details.locator('.sample-label').isVisible());
      assert(await details.locator('.rationale').isVisible());
      assert(!(await page.evaluate(()=>document.documentElement.scrollWidth > document.documentElement.clientWidth+1)),`Expanded sample overflow: ${width}px`);
      await details.locator('summary').click();
    }
    const accessibility = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(accessibility.violations,[],`Accessibility violations at ${width}px`);
    assert.deepEqual(errors,[],`Console or resource errors at ${width}px`);
    results.push({width,overflow:false,samples:true,keyboard:true,accessibilityViolations:0,consoleErrors:0});
    await context.close();
  }
  for (const viewport of [{width:720,height:500},{width:844,height:390}]) {
    const context = await browser.newContext({viewport,reducedMotion:'reduce'});
    const page = await context.newPage();
    await page.goto(url,{waitUntil:'networkidle'});
    assert(!(await page.evaluate(()=>document.documentElement.scrollWidth > document.documentElement.clientWidth+1)), 'Landscape/reflow overflow');
    await page.locator('#sample-email summary').click();
    assert(!(await page.evaluate(()=>document.documentElement.scrollWidth > document.documentElement.clientWidth+1)), 'Expanded landscape/reflow overflow');
    await context.close();
  }
  // Observe actual CSS entrances at mobile and desktop widths.
  for (const width of [390,1440]) {
    const motionContext = await browser.newContext({viewport:{width,height:1000},reducedMotion:'no-preference'});
    const motionPage = await motionContext.newPage();
    const motionErrors = [];
    motionPage.on('pageerror', error=>motionErrors.push(error.message));
    await motionPage.addInitScript(() => {
      window.__motionStarts = [];
      document.addEventListener('animationstart', event => {
        if (event.animationName === 'portfolio-reveal') window.__motionStarts.push(event.target);
      },true);
    });
    await motionPage.goto(url,{waitUntil:'domcontentloaded'});
    await motionPage.waitForFunction(() => window.__motionStarts.length > 0);
    assert(await motionPage.locator('.portrait-card img').isVisible(),'Brand portrait unavailable');
    assert(await motionPage.locator('.portrait-card img').evaluate(image=>image.complete && image.naturalWidth > 0),'Portrait failed to load');
    const details = motionPage.locator('#sample-email details');
    await details.locator('summary').click();
    await motionPage.waitForFunction(() => window.__motionStarts.includes(document.querySelector('#sample-email .sample-full')));
    await motionPage.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== 'running'));
    await details.locator('summary').click();
    await details.locator('summary').click();
    await motionPage.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await motionPage.evaluate(() => window.__motionStarts.filter(element=>element===document.querySelector('#sample-email .sample-full')).length),1,'Samples must enter only once');
    assert(!(await motionPage.evaluate(()=>document.documentElement.scrollWidth > document.documentElement.clientWidth+1)),`Motion overflow at ${width}px`);
    await motionPage.emulateMedia({reducedMotion:'reduce'});
    await motionPage.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== 'running'));
    const countBefore = await motionPage.evaluate(() => window.__motionStarts.length);
    await motionPage.locator('#sample-vsl summary').click();
    await motionPage.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await motionPage.evaluate(() => window.__motionStarts.length),countBefore,'Reduced motion must skip entrances');
    assert(await motionPage.locator('#sample-vsl .sample-full').isVisible(),'Reduced-motion sample content unavailable');
    assert.deepEqual(motionErrors,[],`Motion runtime errors at ${width}px`);
    await motionContext.close();
  }
  const context = await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
  const page = await context.newPage();
  await page.goto(url);
  assert(await page.getByRole('navigation').isVisible(),'Navigation unavailable without JavaScript');
  await page.locator('#sample-email summary').click();
  assert(await page.locator('#sample-email .sample-full').isVisible(),'Sample unavailable without JavaScript');
  await context.close();
  for (const width of [360,390,768,1440]) {
    const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const page = await context.newPage();
    const response = await page.goto(url + '/missing-page-for-qa',{waitUntil:'networkidle'});
    assert.equal(response.status(),404,'Missing route must return 404');
    assert.equal(await page.locator('h1').textContent(),'Page not found');
    assert(await page.getByRole('link',{name:'Back to the homepage'}).isVisible());
    assert(!(await page.evaluate(()=>document.documentElement.scrollWidth > document.documentElement.clientWidth+1)),`404 overflow at ${width}px`);
    assert(!(await page.locator('body').textContent()).includes('—'),'404 copy contains an em dash');
    const accessibility = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(accessibility.violations,[],`404 accessibility violations at ${width}px`);
    await page.screenshot({path:`qa/${width}-404.png`,fullPage:true});
    await context.close();
  }
  await writeFile('qa/browser-results.json',JSON.stringify({results,noJavaScript:true,motion:true,reducedMotion:true},null,2));
  console.log('PASS: browser checks completed. Inspect qa/*-page.png for visual quality; automated checks do not replace visual inspection.');
} finally {await browser.close();}
