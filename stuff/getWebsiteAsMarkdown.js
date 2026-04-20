import { chromium } from 'playwright';

export async function getWebsiteAsMarkdown(website, chromiumDebugPortURL) {
    // Connect to Chrome running with --remote-debugging-port=9222
    if (chromiumDebugPortURL == "" || chromiumDebugPortURL == undefined) {
        chromiumDebugPortURL = 'http://localhost:9222'
    }
    const browser = await chromium.connectOverCDP(chromiumDebugPortURL);
    
    // Launch new Window
    const newContext = await browser.newContext({
        bypassCSP: true   // This works on newly created contexts
    });
    const page = await newContext.newPage();
    // console.log('✅ Connected to Chrome on port 9222');
    
    // Go to page and grab the markdown as a string
    await page.goto(website, { waitUntil: 'networkidle' });
    await page.addScriptTag({
        // url: 'https://unpkg.com/turndown/dist/turndown.js'
        path: './stuff/turndown.js'
    });
    const markdown = await page.evaluate(() => {
        const turndownService = new TurndownService();
        return turndownService.turndown(document.body.innerHTML);
    });
    // console.log(markdown);

    // Close the window created
    await newContext.close();
    return markdown
}
