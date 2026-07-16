// Adds an email to a Resend audience if RESEND_API_KEY + RESEND_AUDIENCE_ID are
// configured. Until then it's a no-op that still returns success, so the form
// works before anyone has wired up the paid-tier waitlist backend.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST only" });
  }
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  const email = body && typeof body.email === "string" ? body.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Provide a valid email" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (apiKey && audienceId) {
    try {
      const resendRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
      if (!resendRes.ok && resendRes.status !== 409) {
        return res.status(502).json({ error: "Could not save your email right now. Try again shortly." });
      }
    } catch {
      return res.status(502).json({ error: "Could not save your email right now. Try again shortly." });
    }
  }
  return res.status(200).json({ ok: true });
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
