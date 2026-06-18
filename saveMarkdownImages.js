import fs from 'fs'
import { saveMarkdownImagesAsCIDs } from './stuff/saveMarkdownImagesAsCIDs.js'


function addSuffixToFilename(pathStr, suffix = '') {
  if (!pathStr || !suffix) return pathStr;

  const lastSlash = Math.max(pathStr.lastIndexOf('/'), pathStr.lastIndexOf('\\'));
  const lastDot = pathStr.lastIndexOf('.');

  // If there's a valid extension, insert suffix before it
  if (lastDot > lastSlash) {
    return pathStr.slice(0, lastDot) + suffix + pathStr.slice(lastDot);
  }

  // No extension → just append suffix
  return pathStr + suffix;
}

const markdown_file_path = './web-content/slatestarcodex.com/2026-06-18_17-30-50/content.md'
const CID_file_path = './web-content/CIDs'
const markdown_output_path = addSuffixToFilename(markdown_file_path, '-CID')


const markdown = fs.readFileSync(markdown_file_path, 'utf-8')
console.log(markdown)
await saveMarkdownImagesAsCIDs(markdown, CID_file_path, markdown_output_path)

console.log(markdown_output_path)