// [Executing within Playwright (headless browser) · gildas-lormeau/SingleFile-MV3 Wiki](https://github.com/gildas-lormeau/SingleFile-MV3/wiki/Executing-within-Playwright-(headless-browser))

import { chromium } from "playwright"
// @ts-expect-error
import { getHookScriptSource, getScriptSource, getZipScriptSource } from "single-file-cli/lib/single-file-script.js"
import { pageToSingleFile } from 'playwright-single-file'

export async function getWebsiteAsSingleHTML(website, chromiumDebugPortURL) {
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

    // Go to page and grab the website as a HTML file
    await page.goto(website);
    await page.waitForTimeout(3000)

    const pageData = await pageToSingleFile(page, {
        removeScripts: true,
        compressHTML: false,
        removeHidden: false,
    })

    await page.close()
    await browser.close()
    return pageData.content

}