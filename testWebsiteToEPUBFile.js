import { getWebsiteAsEPUB } from './getWebsiteAsEPUB.js';

let website = 'https://gwern.net/fiction/craneyard'
let content = await getWebsiteAsEPUB(website)

import fs from 'fs/promises';
await fs.writeFile('./output/output.epub', content);
console.log(content)
