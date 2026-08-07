import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = process.env.PORT || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

createServer(async (req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split("?")[0]);
    if (reqPath === "/") reqPath = "/index.html";
    const filePath = path.join(ROOT, reqPath);
    if (!filePath.startsWith(ROOT)) throw new Error("forbidden");

    const s = await stat(filePath);
    const target = s.isDirectory() ? path.join(filePath, "index.html") : filePath;
    const data = await readFile(target);
    const ext = path.extname(target);
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 not found");
  }
}).listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
});
