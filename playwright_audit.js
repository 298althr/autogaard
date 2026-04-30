const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  const errors = [];
  const consoleMessages = [];

  context.on('page', page => {
    page.on('console', msg => {
      if (msg.type() === 'error') consoleMessages.push(`ERROR: ${msg.text()}`);
    });
    page.on('pageerror', err => errors.push(err.message));
  });

  const results = {};

  const pages = [
    { name: 'Homepage', url: 'https://autogaard.com' },
    { name: 'Vehicles', url: 'https://autogaard.com/vehicles' },
    { name: 'Valuation', url: 'https://autogaard.com/valuation' },
    { name: 'Compare', url: 'https://autogaard.com/compare' },
    { name: 'Contact', url: 'https://autogaard.com/contact' },
    { name: 'Login', url: 'https://autogaard.com/login' },
    { name: 'Register', url: 'https://autogaard.com/register' },
  ];

  for (const p of pages) {
    const page = await context.newPage();
    const pageErrors = [];
    const apiCalls = [];

    page.on('console', msg => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });
    page.on('response', res => {
      if (res.url().includes('railway.app/api') || res.url().includes('autogaard.com/api')) {
        apiCalls.push({ url: res.url().replace(/https:\/\/[^/]+/, ''), status: res.status() });
      }
    });

    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Screenshot dimensions
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      const viewport = page.viewportSize();

      // Check overflow
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      // Check main CTA buttons visible
      const buttons = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('a, button'))
          .filter(el => el.offsetParent !== null)
          .map(el => ({ text: el.textContent?.trim().substring(0, 40), tag: el.tagName }))
          .filter(b => b.text && b.text.length > 2)
          .slice(0, 10);
        return btns;
      });

      // Check images loaded
      const brokenImages = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .filter(img => !img.complete || img.naturalWidth === 0)
          .map(img => img.src?.substring(0, 60));
      });

      // Text content above fold
      const aboveFoldText = await page.evaluate(() => {
        const el = document.querySelector('h1');
        return el ? el.textContent?.trim().substring(0, 100) : 'No H1 found';
      });

      results[p.name] = {
        status: 'ok',
        pageHeight: bodyHeight,
        viewportWidth: viewport?.width,
        horizontalOverflow: hasHorizontalOverflow,
        h1: aboveFoldText,
        ctaButtons: buttons,
        brokenImages,
        apiCalls: apiCalls.slice(0, 8),
        consoleErrors: pageErrors.slice(0, 5),
      };

      await page.screenshot({ path: `playwright_${p.name.toLowerCase()}_mobile.png`, fullPage: false });
    } catch (err) {
      results[p.name] = { status: 'error', error: err.message };
    }
    await page.close();
  }

  // Desktop check for homepage
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('https://autogaard.com', { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: 'playwright_homepage_desktop.png', fullPage: false });
  const desktopH1 = await desktopPage.evaluate(() => document.querySelector('h1')?.textContent?.trim().substring(0, 100));
  results['Homepage_Desktop'] = { h1: desktopH1 };
  await desktopContext.close();

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
