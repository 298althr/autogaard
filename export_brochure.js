const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Brochure Export...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 3508, height: 2480 }, // A4 at 300 DPI (approx)
    deviceScaleFactor: 2 // High resolution
  });

  const filePath = `file://${path.resolve(__dirname, 'brochure.html')}`;
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // Wait for fonts and images to load
  await page.waitForTimeout(2000);

  console.log('📸 Capturing Sheet 1 (Outer: Page 4 | Page 1)...');
  const sheet1 = await page.$('#sheet-1');
  await sheet1.screenshot({ path: 'brochure_sheet_1_outer.png' });

  console.log('📸 Capturing Sheet 2 (Inner: Page 2 | Page 3)...');
  const sheet2 = await page.$('#sheet-2');
  await sheet2.screenshot({ path: 'brochure_sheet_2_inner.png' });

  await browser.close();
  console.log('✅ Export Complete! Files saved:');
  console.log('   - brochure_sheet_1_outer.png');
  console.log('   - brochure_sheet_2_inner.png');
})();
