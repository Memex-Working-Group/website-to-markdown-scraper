import { getWebsiteAsPDF } from './getWebsiteAsPDF.js';

let website = 'https://gwern.net/fiction/craneyard'
let content = await getWebsiteAsPDF(website, './output/output.pdf')
console.log(content)
