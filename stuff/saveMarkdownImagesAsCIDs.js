import fs from 'fs'
import yaml from 'js-yaml'
import Hash from 'ipfs-only-hash'

function extractImageLinksRobust(markdown) {
    const regex = /!\[(?:\\.|[^\[\]])*\]\(\s*([^"\s)]+?)(?:\s+["'][^"']*["'])?\s*\)/g;
    return Array.from(markdown.matchAll(regex), m => m[1].trim());
}

function extractFrontmatter(markdownString) {
    const regex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
    const match = markdownString.match(regex);

    if (match) {
        let yamlToJSON = match[1]
        yamlToJSON = yaml.load(yamlToJSON)
        return yamlToJSON;
    } else {
        return null
    }
}

export async function saveMarkdownImagesAsCIDs(markdown, CID_PATH, output_file_path) {
    let imageLinks = extractImageLinksRobust(markdown)
    let fronmatterYAML = extractFrontmatter(markdown)
    console.log('fronmatterYAML')
    console.log(fronmatterYAML)
    console.log('imageLinks')
    console.log(imageLinks)
    let markdownLinkToCID = {}
    let URLsSaved = []
    for (let imageLink of imageLinks) {
        let imageLinkUrl = imageLink
        if (imageLink[0] == "/") {
            let URLToScrape = new URL(fronmatterYAML.source)
            imageLinkUrl = URLToScrape.origin + imageLink
        }
        if (!(imageLinkUrl in URLsSaved)) {
            console.log(`Fetching: ${imageLinkUrl}`)
            try {
            const response = await fetch(imageLinkUrl);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const CID = await Hash.of(buffer)
            console.log(CID)
            let fileExtension = imageLink.split('.').pop();
            await fs.writeFileSync(`${CID_PATH}/${CID}.${fileExtension}`, buffer)
            markdownLinkToCID[imageLink] = `${CID_PATH}/${CID}.${fileExtension}`
            URLsSaved.push(imageLink)
            } catch (error) {
                console.log('WE_GOT_AN_ERROR_HERE_87987987987987')
                console.log(error)
            }
        } else {
            console.log(`Skipping ${imageLinkUrl}`)
            markdownLinkToCID[imageLink] =  markdownLinkToCID[URLsSaved[URLsSaved.indexOf(imageLinkUrl)]]
        }
    }
    console.log('markdownLinkToCID')
    console.log(markdownLinkToCID)
    let newMarkdown = markdown
    const pattern = new RegExp(Object.keys(markdownLinkToCID).join('|'), 'g')
    const result = newMarkdown.replace(pattern, (matched) => markdownLinkToCID[matched])
    // console.log(result)
    await fs.writeFileSync(output_file_path, result)
}
