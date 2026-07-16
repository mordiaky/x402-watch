import { checkX402Endpoint } from "../lib/check.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST only" });
  }
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  const url = body && typeof body.url === "string" ? body.url.trim() : "";
  if (!/^https:\/\/[^\s]+$/.test(url)) {
    return res.status(400).json({ error: "Provide a https:// url to check" });
  }
  const report = await checkX402Endpoint(url);
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json(report);
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
