import { chromium } from 'playwright';

async function main() {
  // Connect to Chrome running with --remote-debugging-port=9222
  const browser = await chromium.connectOverCDP('http://localhost:9222');

  // // Get the first (usually only) page/context
  // const contexts = browser.contexts();
  // let page;
  // if (contexts.length > 0) {
  //   page = contexts[0].pages()[0];        // Use existing tab
  // } else {
  //   page = await contexts[0].newPage();   // Fallback: create new tab
  // }


  const newContext = await browser.newContext({
    bypassCSP: true   // This works on newly created contexts
  });
  const page = await newContext.newPage();

  console.log('✅ Connected to Chrome on port 9222');

  // Example: Go to a page and load Turndown
  await page.goto('https://github.com/mixmark-io/turndown');

  await page.addScriptTag({
    url: 'https://unpkg.com/turndown/dist/turndown.js'
  });

  const markdown = await page.evaluate(() => {
    const turndownService = new TurndownService();
    return turndownService.turndown(document.body.innerHTML);
  });

  console.log(markdown);
  await newContext.close();
  process.exit()

  // Do NOT call browser.close() — you want to keep your Chrome open
}

main().catch(console.error);