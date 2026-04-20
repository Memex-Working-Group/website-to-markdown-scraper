import { chromium } from 'playwright';
import fs from 'fs';

export async function saveWebpageToFolder(website, outputDirectory, chromiumDebugPortURL) {
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
    try {
        await page.goto(website, {
            timeout: 10000,
            waitUntil: 'commit'
            // waitUntil: 'domcontentloaded',
            // waitUntil: 'networkidle'
        })
    } catch (error) {
        console.log(`There was an error loging the page, going to try and save it anyways, error posted below\n\n${JSON.stringify(error, null, 2)}`)
    }
    console.log('Waiting 10 seconds for webpage to fully load, this is the most reliable method trust')
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('Successfully waited 10 seconds')
    await page.addScriptTag({
        // url: 'https://unpkg.com/turndown/dist/turndown.js'
        path: './stuff/turndown.js'
    });
    console.log('Loaded turndown script to grab markdown')
    const markdown = await page.evaluate(() => {
        const turndownService = new TurndownService();
        return turndownService.turndown(document.body.innerHTML);
    });
    console.log('Markdown fetched')
    // console.log(markdown);
    await fs.writeFileSync(`${outputDirectory}/content.md`, markdown)
    console.log('Markdown saved to file system at ' + `${outputDirectory}/content.md)`)

    // Go to page and save it as a mhtml file
    const session = await newContext.newCDPSession(page);
    const { data: mhtmlData } = await session.send('Page.captureSnapshot');
    // console.log(mhtmlData)
    await fs.writeFileSync(`${outputDirectory}/content.mhtml`, mhtmlData)
    console.log('mhtml saved to file system at ' + `${outputDirectory}/content.mhtml`)

    // Go to page save it as a pdf
    await page.pdf({
        path: outputDirectory + "/content.pdf",           // Save to file
        format: 'Letter',                 // or 'Letter'
        printBackground: true,           // Include background colors/images
    });
    console.log('pdf saved to file system at ' + outputDirectory + "/content.pdf")

    // Close the window created
    await newContext.close();
    return markdown
}
