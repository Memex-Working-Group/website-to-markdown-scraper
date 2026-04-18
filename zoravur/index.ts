import fs from "fs/promises";

async function getUrls() {
  const data = await fs.readFile("urls.txt", "utf-8");
  return data.split("\n");
}

import crypto from "crypto";

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

async function main() {
  let urls = await getUrls();
  for (let url of urls) {
    const res = await imageAndMetadataFetch(url);

    await fs.writeFile(res.saveTo, JSON.stringify(res, null, 2));
  }
}

main();
