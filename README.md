# x402 Watch

A free, instant protocol checker for x402 seller endpoints. Paste a URL, get a
pass/fail report: does the unpaid request return a well-formed 402 challenge,
and is the endpoint actually discoverable in the Coinbase Bazaar catalog paying
agents search?

Built to reach the ~12,000 humans running x402 services today, not the
autonomous agents that (per current research) settle almost no real revenue
yet. See `../plyrium-vouchspec/X402-MARKET-RESEARCH-2026-07-16.md` for the
research this product is based on.

## Why

Every x402 seller has the same blind spot: they can't easily tell if their
challenge is well-formed, or if they're actually in the catalog buyers search.
This tool answers both in one request, for free, with no signup - then offers
an embeddable status badge (real distribution: every badge links back here)
and a waitlist for paid recurring monitoring once demand is proven.

## What it checks

1. **Reachable** - the endpoint responds at all.
2. **Returns 402** - an unpaid `POST` with no body returns `402 Payment Required`.
   (Deliberately bodyless: some sellers, including VouchSpec, only short-circuit
   straight to the challenge on an empty body and validate request shape
   otherwise - a placeholder body like `{}` produces false negatives.)
3. **x402 challenge present** - the `PAYMENT-REQUIRED` header or a JSON
   `accepts[]` body decodes to a real challenge.
4. **Challenge shape valid** - the first accepted option has `scheme`,
   `network`, `payTo`, and an amount field.
5. **Bazaar listed** (informational, not scored) - whether the exact resource
   URL appears in the public Coinbase CDP discovery/search catalog. A resource
   only appears there after its first settled payment through the CDP
   facilitator, so this is a genuine "are you actually discoverable yet" signal.

Known limitation: the checker always uses `POST`. A seller whose paid resource
gates on `GET` (VouchSpec's own `/validate` deliberately returns 200 on `GET`
and only gates `POST`) will need manual verification of that path for now.

## Architecture

Deliberately not a framework app - plain Vercel serverless functions + one
static HTML file, zero build step.

```
public/index.html       - the whole UI (vanilla JS, no bundler)
api/check.js             - POST {url} -> check report JSON
api/badge/[encoded].js    - GET -> SVG status badge (base64url-encoded URL)
api/waitlist.js           - POST {email} -> adds to a Resend audience (no-op until configured)
lib/check.js              - the actual protocol-check logic, shared by check + badge
lib/badge.js               - minimal shields.io-style SVG renderer, no dependencies
dev-server.mjs              - LOCAL ONLY: shims Vercel's (req,res) API so you can run
                              this without a Vercel account. Never deployed.
```

## Run it locally

No Vercel account or login needed for local dev:

```
node dev-server.mjs
```

Then open http://localhost:3411.

## Deploy

This is a stock Vercel project (static `public/` + `api/` functions) - `vercel
deploy` from a logged-in Vercel account, or connect the repo in the Vercel
dashboard. No environment variables are required for the free checker to work.

To turn on the paid-tier waitlist capture, create a Resend audience and set:

- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`

Until those are set, `/api/waitlist` still returns success (so the form never
breaks) but doesn't persist anywhere - a deliberate no-op fallback so this
ships before the audience exists.

## Not built yet (by design - prove demand first)

- Hosted recurring monitoring + email alerts (the actual paid tier). The
  waitlist on the free tool is how we find out if anyone wants to pay for it
  before writing a billing/cron/persistence stack for zero validated demand.
- A standalone npm CLI package. Until then, any CI can call `POST /api/check`
  directly with `curl` - see the badge markdown snippet the tool generates.
- GET-endpoint checking (see Known limitation above).
