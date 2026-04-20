import { chromium } from 'playwright';

export async function getWebsiteAsMHTML(website, chromiumDebugPortURL) {
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

    // Go to page and save it as a mhtml file
    await page.goto(website, { waitUntil: 'networkidle' });
    const session = await newContext.newCDPSession(page);
    const { data: mhtmlData } = await session.send('Page.captureSnapshot');
    // console.log(mhtmlData);
    
    await newContext.close();
    return mhtmlData
}
