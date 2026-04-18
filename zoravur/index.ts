import fs from "fs/promises";
import crypto from "crypto";
import { getWebsiteAsMarkdown } from "../paulsStuff/getWebsiteAsMarkdown.js";

async function getUrls() {
  const data = await fs.readFile("urls.txt", "utf-8");
  return data.split("\n");
}

/**
 * @param {ArrayBuffer} arrayBuffer
 * @returns {string} hex-encoded SHA-256 hash
 */
function sha256FromArrayBuffer(arrayBuffer: ArrayBuffer) {
  const buffer = Buffer.from(arrayBuffer);

  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function imageAndMetadataFetch(url: string) {
  const urlObj = new URL(url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }

  // URL-derived metadata
  const urlMeta = {
    fullUrl: urlObj.href,
    origin: urlObj.origin,
    pathname: urlObj.pathname,
    filename: urlObj.pathname.split("/").pop() || null,
    extension: urlObj.pathname.includes(".")
      ? urlObj.pathname.split(".").pop()
      : null,
    search: urlObj.search || null,
  };

  // HTTP-level metadata
  const headerMeta = {
    contentType: response.headers.get("content-type"),
    contentLength: response.headers.get("content-length"),
    lastModified: response.headers.get("last-modified"),
    etag: response.headers.get("etag"),
    cacheControl: response.headers.get("cache-control"),
  };

  const hash = sha256FromArrayBuffer(await response.arrayBuffer());

  return {
    url: urlMeta,
    http: headerMeta,
    hash,
    saveTo: `${hash}.json`,
  };
}

function imageUrlExtract(markdown: string): string[] {
  const imageUrls = [];

  // 1) Markdown image syntax: ![alt](url "optional title")
  const mdImageRegex = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;

  while ((match = mdImageRegex.exec(markdown)) !== null) {
    imageUrls.push(match[1]);
  }

  // 2) HTML <img src="...">
  const htmlImgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  while ((match = htmlImgRegex.exec(markdown)) !== null) {
    imageUrls.push(match[1]);
  }

  return imageUrls.filter((i) => i != null);
}

async function main() {
  const website = "https://ipld.io/docs/codecs/known/dag-cbor/";

  const markdown = await getWebsiteAsMarkdown(website);

  const urls = imageUrlExtract(markdown);

  // let urls = await getUrls();
  for (let url of urls) {
    const res = await imageAndMetadataFetch(url);

    await fs.writeFile(res.saveTo, JSON.stringify(res, null, 2));
  }
}

main();
