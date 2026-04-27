import { getWebsiteAsSingleHTML } from '../stuff/getWebsiteAsSingleHTMLFile.js';

// https://www.astralcodexten.com/p/the-dilbert-afterlife

let website = 'https://gwern.net/fiction/craneyard'
let content = await getWebsiteAsSingleHTML(website)

import fs from 'fs/promises';
await fs.writeFile('./output/output.html', content);
console.log(content)
