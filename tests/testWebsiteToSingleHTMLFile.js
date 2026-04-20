import { getWebsiteAsMHTML } from "../stuff/getWebsiteAsMHTML.js";

// https://www.astralcodexten.com/p/the-dilbert-afterlife

let website = 'https://gwern.net/fiction/craneyard'
let content = await getWebsiteAsMHTML(website)

import fs from 'fs/promises';
await fs.writeFile('./output/output.mhtml', content);
console.log(content)
