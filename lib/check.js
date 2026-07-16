const TIMEOUT_MS = 10_000;
const BAZAAR_SEARCH_URL = "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search";

function normalizeUrl(url) {
  return url.replace(/\/$/, "");
}

function decodeChallenge(response, bodyJson) {
  const header = response.headers.get("payment-required") || response.headers.get("x-payment-required");
  if (header) {
    try {
      const decoded = JSON.parse(Buffer.from(header, "base64").toString("utf8"));
      if (decoded && Array.isArray(decoded.accepts)) return { challenge: decoded, source: "PAYMENT-REQUIRED header" };
    } catch {
      // fall through to body
    }
  }
  if (bodyJson && Array.isArray(bodyJson.accepts)) return { challenge: bodyJson, source: "JSON response body" };
  return { challenge: null, source: null };
}

async function checkBazaarListing(url) {
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return { listed: false, detail: "Could not parse hostname" };
  }
  try {
    const search = await fetch(`${BAZAAR_SEARCH_URL}?query=${encodeURIComponent(hostname)}&limit=20`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!search.ok) return { listed: false, detail: `Bazaar search returned HTTP ${search.status}` };
    const data = await search.json();
    const resources = Array.isArray(data.resources) ? data.resources : [];
    const target = normalizeUrl(url);
    const listed = resources.some(r => typeof r.resource === "string" && normalizeUrl(r.resource) === target);
    return {
      listed,
      detail: listed
        ? "Found in the Coinbase Bazaar catalog"
        : `Not found among ${resources.length} result(s) for this host - a resource is only catalogued after its first settled CDP payment`,
    };
  } catch (err) {
    return { listed: false, detail: `Bazaar search failed: ${String(err && err.message || err)}` };
  }
}

/** Runs a read-only x402 protocol check against a seller's endpoint. Never sends a payment. */
export async function checkX402Endpoint(url) {
  const checks = [];
  const started = Date.now();
  let response;
  try {
    // Deliberately no body: the x402 discovery convention is that a resource
    // gates on payment before it looks at the request body at all, and some
    // sellers (VouchSpec included) only short-circuit straight to the 402
    // challenge on a genuinely empty body - a placeholder body like "{}" can
    // fall through to their own request-schema validation instead and produce
    // a false negative here.
    response = await fetch(url, {
      method: "POST",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    return {
      url,
      checked_at: new Date().toISOString(),
      ok: false,
      score: 0,
      checks: [{ name: "reachable", pass: false, detail: `Request failed: ${String(err && err.message || err)}` }],
    };
  }
  const latencyMs = Date.now() - started;
  checks.push({ name: "reachable", pass: true, detail: `HTTP ${response.status} in ${latencyMs}ms` });
  checks.push({
    name: "returns_402",
    pass: response.status === 402,
    detail: response.status === 402 ? "Unpaid request correctly returns 402 Payment Required" : `Expected 402, got HTTP ${response.status}`,
  });

  let bodyJson = null;
  try {
    bodyJson = await response.clone().json();
  } catch {
    // Body isn't JSON - fine, the header may still carry the challenge.
  }
  const { challenge, source } = decodeChallenge(response, bodyJson);
  const hasChallenge = Boolean(challenge);
  checks.push({
    name: "x402_challenge_present",
    pass: hasChallenge,
    detail: hasChallenge ? `Decodable challenge found in ${source}` : "No decodable PAYMENT-REQUIRED header or JSON accepts[] body",
  });

  const accept = hasChallenge ? challenge.accepts[0] : null;
  const validShape = Boolean(accept && accept.scheme && accept.network && accept.payTo && (accept.amount || accept.maxAmountRequired));
  checks.push({
    name: "challenge_shape_valid",
    pass: validShape,
    detail: validShape ? `${accept.scheme} on ${accept.network}, pays ${accept.payTo}` : "Missing scheme/network/payTo/amount on the first accepted option",
  });

  const bazaar = await checkBazaarListing(url);
  checks.push({ name: "bazaar_listed", pass: bazaar.listed, detail: bazaar.detail, informational: true });

  const scored = checks.filter(c => !c.informational);
  const score = Math.round((scored.filter(c => c.pass).length / scored.length) * 100);

  return {
    url,
    checked_at: new Date().toISOString(),
    latency_ms: latencyMs,
    http_status: response.status,
    score,
    ok: score === 100,
    checks,
  };
}
