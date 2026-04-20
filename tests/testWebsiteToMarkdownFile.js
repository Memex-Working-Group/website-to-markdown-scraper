import { getWebsiteAsMarkdown } from "../stuff/getWebsiteAsMarkdown.js";

let website = 'https://www.astralcodexten.com/p/the-dilbert-afterlife'
let content = await getWebsiteAsMarkdown(website)

import fs from 'fs/promises';
await fs.writeFile('./output/output.md', content);
console.log(content)
