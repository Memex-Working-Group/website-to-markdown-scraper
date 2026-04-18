import { getWebsiteAsMarkdown } from "./getWebsiteAsMarkdown.js";

let website = 'https://www.lesswrong.com/posts/bxt7uCiHam4QXrQAA/cyborgism'
let markdown = await getWebsiteAsMarkdown(website)

import fs from 'fs/promises';
await fs.writeFile('output.md', markdown);
console.log(markdown)
