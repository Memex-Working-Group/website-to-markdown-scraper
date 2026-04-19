import { chromium } from 'playwright';
import epubModule from '@epubkit/epub-gen-memory';
const epub = epubModule.default || epubModule;
import fs from 'fs';

export async function getWebsiteAsPDF(website, outputFilePath, chromiumDebugPortURL) {
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
    await page.goto(website, { waitUntil: 'networkidle' });
    // console.log('✅ Connected to Chrome on port 9222');

    // Go to page save it as a pdf
    const content = await page.pdf({
        path: outputFilePath,           // Save to file
        format: 'Letter',                 // or 'Letter'
        printBackground: true,           // Include background colors/images
    });

    await newContext.close();
    return content

    // Do NOT call browser.close() — you want to keep your Chrome open
}
