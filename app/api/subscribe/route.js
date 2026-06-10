import { NextResponse } from "next/server";

/**
 * Email capture endpoint.
 *
 * Pick ONE provider by setting env vars (see README + .env.example).
 * The route auto-detects which provider is configured.
 *
 *   EMAIL_PROVIDER = "buttondown" | "mailchimp" | "sheet" | "console"
 *
 * Default is "console" (just logs) so the form works out of the box
 * in local dev with zero setup.
 */

export const runtime = "nodejs";

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function saveToButtondown(email) {
  // Keyless: uses Buttondown's embed endpoint, which works on the FREE tier
  // and exposes no secret. Set BUTTONDOWN_USERNAME to your public newsletter
  // username (NOT an API key). Called server-side here to avoid CORS and to
  // keep the custom success message.
  const username = process.env.BUTTONDOWN_USERNAME;
  if (!username) throw new Error("Missing BUTTONDOWN_USERNAME");

  const form = new URLSearchParams();
  form.set("email", email);
  form.set("embed", "1");

  const res = await fetch(
    `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(
      username
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Buttondown error ${res.status}: ${body}`);
  }
}

async function saveToMailchimp(email) {
  const key = process.env.MAILCHIMP_API_KEY; // e.g. abc123-us21
  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!key || !listId) throw new Error("Missing Mailchimp env vars");

  const dc = key.split("-")[1];
  const res = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `apikey ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, status: "subscribed" }),
    }
  );

  if (!res.ok && res.status !== 400) {
    const body = await res.text();
    throw new Error(`Mailchimp error ${res.status}: ${body}`);
  }
}

async function saveToSheet(email) {
  // Posts to a Google Apps Script Web App or any webhook you control.
  const url = process.env.SHEET_WEBHOOK_URL;
  if (!url) throw new Error("Missing SHEET_WEBHOOK_URL");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheet webhook error ${res.status}: ${body}`);
  }
}

export async function POST(request) {
  let email;
  try {
    const body = await request.json();
    email = (body.email || "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const provider = (process.env.EMAIL_PROVIDER || "console").toLowerCase();

  try {
    switch (provider) {
      case "buttondown":
        await saveToButtondown(email);
        break;
      case "mailchimp":
        await saveToMailchimp(email);
        break;
      case "sheet":
        await saveToSheet(email);
        break;
      case "console":
      default:
        // Local dev fallback — no external service required.
        console.log(`[subscribe] ${new Date().toISOString()} ${email}`);
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Could not subscribe right now. Please try again." },
      { status: 500 }
    );
  }
}
