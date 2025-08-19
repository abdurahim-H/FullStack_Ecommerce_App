const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  const base = 'http://127.0.0.1:3000';

  try {
    console.log('goto', base);
    await page.goto(base, { waitUntil: 'networkidle2' });

    // click first product link
    await page.waitForSelector('a[href^="/product/"]', { timeout: 10000 });
    const prodHref = await page.$eval('a[href^="/product/"]', el => el.getAttribute('href'));
    console.log('product href', prodHref);
    await page.goto(base + prodHref, { waitUntil: 'networkidle2' });

    // wait for product details to render and click the client-side 'Pay with Stripe' button
    await page.waitForSelector('button', { timeout: 10000 });
    // prefer the Buy button with 'Pay with Stripe' text
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent && b.textContent.includes('Pay with Stripe'));
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (!clicked) {
      // fallback: click any link that ends with /checkout/
      const checkoutLinkEl = await page.$('a[href$="/checkout/"]');
      if (checkoutLinkEl) {
        await checkoutLinkEl.click();
      }
    }
    // wait for either login form or checkout summary to appear
    await Promise.race([
      page.waitForSelector('input[name="username"]', { timeout: 10000 }),
      page.waitForSelector('h3', { timeout: 10000 })
    ]);

    // login if prompted
    const loginUsername = await page.$('input[name="username"]');
    if (loginUsername) {
      console.log('filling login');
      await page.type('input[name="username"]', 'ui_test_user');
      await page.type('input[name="password"]', 'testpass123');
      // click submit button
      await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
      ]);
    }

    // wait for checkout summary
    await page.waitForSelector('h3:has-text("Checkout Summary")', { timeout: 10000 });
    console.log('on checkout page');

    // open stripe card form
    const enterBtn = await page.$x("//button[contains(., 'Enter stripe card')]");
    if (enterBtn.length) {
      await enterBtn[0].click();
      await page.waitForSelector('input[placeholder="Enter Your Card Number"]', { timeout: 10000 });
      await page.type('input[placeholder="Enter Your Card Number"]', '4242424242424242');
      // exp month select - first select on the page
      await page.select('select', '12');
      // exp year select - the second select element
      await page.select('select:nth-of-type(2)', '2030');
      await page.type('input[placeholder="123"]', '123');
      await Promise.all([
        page.click('button:has-text("Submit")'),
        page.waitForResponse(response => response.url().includes('/payments/create-card/') && response.status() < 500, { timeout: 10000 })
      ]);
      console.log('card submitted');
    } else {
      console.log('enter card button not found');
    }

    // click Pay
    await page.waitForSelector('button:has-text("Pay ₹")', { timeout: 10000 });
    await Promise.all([
      page.click('button:has-text("Pay ₹")'),
      page.waitForResponse(response => response.url().includes('/payments/charge-customer/') && response.status() < 500, { timeout: 10000 })
    ]);
    console.log('clicked pay');

    // try to detect success page
    const successText = await page.$('text=Payment Successfull');
    if (successText) console.log('Payment success text found');
    else console.log('Payment may have completed (could not detect success text)');

    console.log('UI checkout completed');
  } catch (err) {
    console.error('UI checkout error', err.message);
    const html = await page.content();
    console.error('page html snapshot length', html.length);
  } finally {
    await browser.close();
  }
})();
