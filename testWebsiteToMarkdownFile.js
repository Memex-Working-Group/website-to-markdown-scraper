import { getWebsiteAsMarkdown } from "./getWebsiteAsMarkdown.js";

let website = 'https://gwern.net/fiction/craneyard'
let content = await getWebsiteAsMarkdown(website)

import fs from 'fs/promises';
await fs.writeFile('./output/output.md', content);
console.log(content)
