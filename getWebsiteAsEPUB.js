import { chromium } from 'playwright';
import epubModule from '@epubkit/epub-gen-memory';
const epub = epubModule.default || epubModule;
import fs from 'fs';

export async function getWebsiteAsEPUB(website, chromiumDebugPortURL) {
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

    // Optional: Clean up the page (remove ads, nav, footers, etc.)
    await page.evaluate(() => {
        document.querySelectorAll('nav, header, footer, .ad, .ads, .cookie-banner, script, style')
            .forEach(el => el.remove());
    });

    const title = await page.title();
    let htmlContent = await page.content();

    console.log(`📖 Generating EPUB: ${title}`);

    const options = {
        title: title,
        author: "Webpage Converter",
        // Optional: Add CSS for better e-reader styling
        css: `
            body { font-family: Georgia, serif; line-height: 1.6; }
            img { max-width: 100%; height: auto; }
            h1, h2, h3 { page-break-after: avoid; }
        `
    }
    const epubContent = [
        {
            title: title,
            content: htmlContent,           // Full HTML
        }
    ]
    console.log(typeof (options.content))
    await fs.writeFileSync('./out.json', JSON.stringify(options))
    const content = await epub(options, epubContent)
    console.log(content)

    await newContext.close();
    return content

    // Do NOT call browser.close() — you want to keep your Chrome open
}
