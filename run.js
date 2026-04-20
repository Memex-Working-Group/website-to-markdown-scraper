import { parseICLI } from "./stuff/parseICLI.js";
import fs from 'fs';
import { getWebsiteAsMHTML } from "./stuff/getWebsiteAsMHTML.js";
import { getWebsiteAsMarkdown } from "./stuff/getWebsiteAsMarkdown.js";
import { getWebsiteAsPDF } from "./stuff/getWebsiteAsPDF.js";

let program = parseICLI.parse()
let options = program.opts();
let args = program.args

console.log(options)
console.log(args)

let URLtoScrape
try {
    URLtoScrape = new URL(args[0])
} catch (error) {
    console.log(`The URL you provided "${args[0]}" is not valid, see error below for more details\n\n${JSON.stringify(error, null, 2)}`)
    process.exit(2)
}

// Make directory to save stuff into
function timestamp() {
  const d = new Date();

  const pad = (n) => String(n).padStart(2, '0');

  return (
    d.getFullYear() + '-' +
    pad(d.getMonth() + 1) + '-' +
    pad(d.getDate()) + '_' +
    pad(d.getHours()) + '-' +
    pad(d.getMinutes()) + '-' +
    pad(d.getSeconds())
  );
}
const outputDirectory = `./web-content/${URLtoScrape.hostname}/${timestamp()}`
try {
    await fs.mkdirSync(outputDirectory, { recursive: true });   
} catch (error) {
    console.log(`Tried creating directory "${outputDirectory}" but got error, see error below for more details\n\n${JSON.stringify(error, null, 2)}`)
}

// Save and export the markdown
let markdownContent = await getWebsiteAsMarkdown(URLtoScrape.href)
await fs.writeFileSync(`${outputDirectory}/content.md`, markdownContent)

// Save the PDF version of the website
await getWebsiteAsPDF(URLtoScrape.href, `${outputDirectory}/content.pdf`)

// Save the mhtml version of the website
let htmlContent = await getWebsiteAsMHTML(URLtoScrape.href)
await fs.writeFileSync(`${outputDirectory}/content.mhtml`, htmlContent);
