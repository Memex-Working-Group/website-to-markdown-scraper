import { chromium } from 'playwright';
import fs from 'fs';
import { pageToSingleFile } from 'playwright-single-file'

const getISOInTimeZone = (timeZone) => {
  const now = new Date();
  
  // Create a formatter for the specific timezone
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });

  // sv-SE (Sweden) locale is used because it naturally uses the YYYY-MM-DD format
  const parts = formatter.formatToParts(now);
  const map = new Map(parts.map(p => [p.type, p.value]));

  return `${map.get('year')}-${map.get('month')}-${map.get('day')}T${map.get('hour')}:${map.get('minute')}:${map.get('second')}.${map.get('fractionalSecond')}`;
};

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
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('Successfully waited 5 seconds')
    await page.addScriptTag({
        // url: 'https://unpkg.com/turndown/dist/turndown.js'
        path: './stuff/turndown.js'
    });
    console.log('Loaded turndown script to grab markdown')
    const markdown = await page.evaluate(() => {
        const turndownService = new TurndownService();
        return turndownService.turndown(document.body.innerHTML);
    });
    const now = new Date();
    const date = now.toLocaleString('sv-SE', { timeZoneName: 'short' });
    let markdownWithMetadata = "---\n" + 
      `source: ${website}\n` +
      `created: ${date}\n` +
      "---\n" + markdown
    console.log('Markdown fetched')
    // console.log(markdown);
    await fs.writeFileSync(`${outputDirectory}/content.md`, markdownWithMetadata)
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

    const HTMLPageData = await pageToSingleFile(page, {
        removeScripts: true,
        compressHTML: false,
        removeHidden: false,
    })
    await fs.writeFileSync(`${outputDirectory}/content.html`, HTMLPageData.content)
    console.log('HTML saved to file system at ' + `${outputDirectory}/content.mhtml`)

    // Close the window created
    await newContext.close();
    return markdown
}
