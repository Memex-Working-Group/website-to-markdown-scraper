import { chromium } from 'playwright';
import fs from 'fs/promises';

export async function getWebsiteAsMHTML(website, chromiumDebugPortURL) {
    // Connect to Chrome running with --remote-debugging-port=9222
    if (chromiumDebugPortURL == "" || chromiumDebugPortURL == undefined) {
        chromiumDebugPortURL = 'http://localhost:9222'
    }
    const browser = await chromium.connectOverCDP(chromiumDebugPortURL);

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
    await page.goto(website, { waitUntil: 'networkidle' });
    console.log('✅ Connected to Chrome on port 9222');

    const session = await newContext.newCDPSession(page);
    const { data: mhtmlData } = await session.send('Page.captureSnapshot');
    // console.log(mhtmlData);
    await newContext.close();
    return mhtmlData

    // Do NOT call browser.close() — you want to keep your Chrome open
}
