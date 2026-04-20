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


// Save and export the markdown
let content = await getWebsiteAsMarkdown(website)
await fs.writeFileSync('./output/output.md', content);


