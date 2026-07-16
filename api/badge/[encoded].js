import { checkX402Endpoint } from "../../lib/check.js";
import { renderBadgeSvg } from "../../lib/badge.js";

export default async function handler(req, res) {
  const { encoded } = req.query;
  let url;
  try {
    url = Buffer.from(String(encoded), "base64url").toString("utf8");
    if (!/^https:\/\//.test(url)) throw new Error("not https");
  } catch {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(400).send(renderBadgeSvg("x402", "bad url", "#e05d44"));
  }

  const report = await checkX402Endpoint(url);
  const scored = report.checks.filter(c => !c.informational);
  const passed = scored.filter(c => c.pass).length;
  const message = report.ok ? "healthy" : `${passed}/${scored.length} checks`;
  const color = report.ok ? "#3fb950" : report.score >= 50 ? "#d4a72c" : "#e05d44";

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=60");
  return res.status(200).send(renderBadgeSvg("x402", message, color));
}
