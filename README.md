# Manifold Labs — landing site

A minimal Next.js (App Router) landing page, styled after sky.app.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The email form works immediately — in dev it logs
submissions to your terminal (no external service required).

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com). It's a zero-config
Next.js app. Set your environment variables (below) in the Vercel dashboard.

---

## The font (PP Editorial New)

PP Editorial New is a **commercial font from Pangram Pangram**. The `.otf` files
installed in your Mac's Font Book are licensed for **desktop** use only and
cannot legally be served on the web.

To use the real font:

1. Buy a **web license** at pangrampangram.com — this gives you `.woff2` files
   cleared for web embedding.
2. Drop them into `public/fonts/` with these names:
   - `PPEditorialNew-Regular.woff2`
   - `PPEditorialNew-Italic.woff2`
   - `PPEditorialNew-Bold.woff2`

Until then, the site falls back to **Newsreader** (a close, free high-contrast
serif loaded from Google Fonts), then Georgia. The `@font-face` rules are in
`app/globals.css`.

---

## Capturing emails (so you have visibility into the list)

The form posts to `app/api/subscribe/route.js`, which supports several providers.
Pick one by setting `EMAIL_PROVIDER` in your environment.

### Option A — Buttondown (recommended for you)

Best fit: you own the data, dead-simple API, clean dashboard, free up to 100
subscribers. Good for a technical founder who wants a real list, not a black box.

1. Sign up at buttondown.com, grab your API key from Settings → API.
2. Set env vars:
   ```
   EMAIL_PROVIDER=buttondown
   BUTTONDOWN_API_KEY=your_key
   ```
3. Subscribers appear in your Buttondown dashboard. Export to CSV anytime.

### Option B — Mailchimp

If you want full marketing-email tooling later.

```
EMAIL_PROVIDER=mailchimp
MAILCHIMP_API_KEY=xxxx-us21
MAILCHIMP_LIST_ID=your_audience_id
```

### Option C — Google Sheet (max visibility, you own everything)

Submissions land as rows in a spreadsheet you control.

1. Create a Google Sheet with columns `email`, `timestamp`.
2. Extensions → Apps Script, paste:
   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([data.email, data.timestamp]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. Deploy → New deployment → Web app → "Anyone" can access. Copy the URL.
4. Set env vars:
   ```
   EMAIL_PROVIDER=sheet
   SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
   ```

### Option D — console (default, dev only)

No setup. Logs each email to the server terminal. Fine for local testing,
not for production.

> See `.env.example` for the full list. Copy it to `.env.local` to configure
> locally; set the same vars in Vercel for production.

---

## What's a placeholder right now

- **Favicon** — `app/icon.svg` is a simple "M" mark. Replace it with your real
  icon (Next.js auto-serves `app/icon.svg` / `app/favicon.ico`).
- **Font** — runs on the Newsreader (display) + JetBrains Mono (body) web
  fallbacks until you license and host PP Editorial New (see the font section
  above). The wordmark uses the display face; all body, form, and footer text
  uses mono.
