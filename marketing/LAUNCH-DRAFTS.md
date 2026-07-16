# Launch drafts - DRAFT ONLY, nothing has been posted

Both drafts are ready to use as-is. Neither has been submitted or posted
anywhere - that's your call to make and your account to post from.

Live links (deployed 2026-07-16):
- x402 Watch: https://x402-watch-eight.vercel.app
- x402 Watch source: https://github.com/mordiaky/x402-watch
- x402 seller starter source: https://github.com/mordiaky/x402-seller-starter

Remaining before posting:
- [ ] Consider a nicer domain than the `*.vercel.app` one for x402 Watch (optional)
- [ ] Decide: post from a personal account/handle, or a project one?

---

## Show HN

**Title (80 char limit):**
```
Show HN: x402 Watch – check if your agentic-payment endpoint actually works
```

**URL:** https://x402-watch-eight.vercel.app

**First comment (post this yourself right after submitting - HN convention
for "Show HN" is the submitter adds context in the first comment):**

```
I've been running VouchSpec (github.com/mordiaky/vouchspec), a small x402
service that sells signed validation receipts to AI agents for $0.25 in USDC.
It's been live on Base mainnet for a couple weeks. Revenue so far: $0.

That sent me down a research rabbit hole on what's actually happening in the
x402 ecosystem right now. Short version: genuine (non-wash-traded) settlement
across the whole ecosystem is only around $1.6M per 30 days - roughly half of
all x402 transactions to date are gaming leaderboards or meme-coin farming,
not real purchases. Daily activity is down over 90% from its December peak.
Coinbase's own docs call service discovery "the biggest barrier to x402
adoption," and I believe them - I couldn't find a single independently
verified example of an x402 seller with sustained organic revenue.

So: the buyers aren't autonomous agents yet, not really. They're humans
building x402 services - there are something like 12,000 of them listed in
Coinbase's Bazaar catalog. That's who I built this for.

x402 Watch is a free, instant check: paste your endpoint, it sends an unpaid
request and tells you (a) whether you return a well-formed 402 challenge and
(b) whether you're actually discoverable in the Bazaar catalog agents search
- which, it turns out, only happens after your first real settled payment,
with no separate registration step. That second part surprised me and I
suspect it surprises a lot of sellers.

Also shipped a companion: github.com/mordiaky/x402-seller-starter, a minimal
Next.js + Coinbase CDP reference for standing up a paid endpoint, since
Vercel's official starter for this was archived in December with nothing to
replace it.

Both are free and open source. Feedback very welcome, especially if you're
running an x402 service yourself and have a different read on any of this.
```

---

## X / Twitter thread

**Tweet 1 (hook):**
```
I ran an AI-agent-only payment API for two weeks. $0 revenue.

So I went and found out what's actually happening in the x402 ecosystem
right now. It's not what the headlines say.

Thread 🧵
```

**Tweet 2:**
```
The service: VouchSpec. Sells signed validation receipts for exact GitHub
commits to AI agents, $0.25 in USDC, live on Base mainnet. Full x402 v2
payment flow, works end to end. Zero unrelated buyers so far.
```

**Tweet 3:**
```
Headlines say x402 is doing $24M+ in volume. I went looking for the real,
non-wash-traded number.

It's about $1.6M per 30 days. Across the ENTIRE ecosystem. Not per service -
total.

~Half of all x402 transactions to date are leaderboard gaming or meme-coin
farming, not purchases.
```

**Tweet 4:**
```
Daily activity is down more than 90% from its December 2025 peak.

Coinbase's own docs say service discovery is "the biggest barrier to x402
adoption." After a couple weeks of trying to get my one service discovered,
I believe them.
```

**Tweet 5:**
```
I couldn't find a single independently verified x402 seller with sustained
organic revenue. Every "here are the top earners" list I found failed
fact-checking.

If your service is making real money on x402 right now, I'd genuinely love
to hear about it - replies open.
```

**Tweet 6 (the turn):**
```
Here's the part that actually matters: the real buyers on x402 right now
aren't autonomous agents. They're the ~12,000 humans who've listed a service
in Coinbase's Bazaar catalog.

So that's who I built for next.
```

**Tweet 7:**
```
x402 Watch: paste your endpoint, get an instant free report - does it return
a valid 402 challenge, and are you actually in the Bazaar catalog agents
search?

That second part only happens after your first real settled payment. No
separate registration. A lot of sellers don't know that.

https://x402-watch-eight.vercel.app
```

**Tweet 8:**
```
Also built the seller starter Vercel never replaced after archiving theirs
in December: a minimal Next.js + Coinbase CDP reference for standing up a
paid endpoint from scratch.

https://github.com/mordiaky/x402-seller-starter
```

**Tweet 9 (close):**
```
Both free, both open source. VouchSpec is still live and still selling
receipts for $0.25 if any agent out there wants to be buyer #1.

https://vouchspec.plyrium.com
```

---

## Notes on tone (why it's written this way)

- Leads with the failure ($0 revenue), not the pitch - that's the honest and
  the higher-performing framing for both HN and X; self-aware failure stories
  consistently outperform "look what I built" posts.
- Every number is from the verified research
  (`../plyrium-vouchspec/X402-MARKET-RESEARCH-2026-07-16.md`) - nothing here
  should be tightened or rounded further without checking that file, since a
  wrong number in a thread like this is the kind of thing that gets
  fact-checked in the replies.
- Doesn't claim x402 Watch or the starter solve the demand problem - they're
  positioned as "the honest next step," which is also just true.
