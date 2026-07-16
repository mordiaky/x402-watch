// Local-only dev server that shims Vercel's serverless (req, res) API surface
// well enough to exercise api/*.js handlers without needing a Vercel account.
// Production runs on real Vercel functions - this file is never deployed.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import checkHandler from "./api/check.js";
import waitlistHandler from "./api/waitlist.js";
import badgeHandler from "./api/badge/[encoded].js";

const PORT = process.env.PORT || 3411;
const PUBLIC_DIR = join(import.meta.dirname, "public");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

function shimResponse(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(body)); };
  res.send = (body) => { res.end(body); };
  return res;
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  try { return text ? JSON.parse(text) : {}; } catch { return {}; }
}

const server = http.createServer(async (req, res) => {
  shimResponse(res);
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "POST" && url.pathname === "/api/check") {
    req.body = await readJsonBody(req);
    return checkHandler(req, res);
  }
  if (req.method === "POST" && url.pathname === "/api/waitlist") {
    req.body = await readJsonBody(req);
    return waitlistHandler(req, res);
  }
  const badgeMatch = url.pathname.match(/^\/api\/badge\/([^/]+)$/);
  if (badgeMatch) {
    req.query = { encoded: badgeMatch[1] };
    return badgeHandler(req, res);
  }

  // Static file serving for public/
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  try {
    const data = await readFile(join(PUBLIC_DIR, filePath));
    res.setHeader("Content-Type", MIME[extname(filePath)] || "application/octet-stream");
    return res.end(data);
  } catch {
    res.status(404).send("Not found");
  }
});

server.listen(PORT, () => console.log(`x402-watch dev server on http://localhost:${PORT}`));
