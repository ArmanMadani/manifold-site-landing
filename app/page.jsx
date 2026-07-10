"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ok | err
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "loading") return;

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("err");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("ok");
        setMessage("You're on the list. We'll be in touch.");
        setEmail("");
      } else {
        setStatus("err");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("err");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="page">
      <main className="main">
        <div className="container">
          <div className="content">
            <h1 className="wordmark">manifold labs</h1>

            <p className="section-label">about</p>
            <div className="copy">
              <p>
                manifold labs is an ai research lab dedicated to exploring
                human-ai interaction. our goals are:
              </p>
              <ol>
                <li>
                  to make agent use broadly accessible and
                  economically viable
                </li>
                <li>
                  to make agents safe and effective in
                  highly-regulated domains
                </li>
                <li>
                  to reduce barriers to open-source and local model usage
                </li>
              </ol>
            </div>

            <p className="section-label">projects</p>
            <p className="coming-soon">&gt;&gt;&gt;  coming soon</p>

            <form className="signup" onSubmit={handleSubmit} noValidate>
              <div className="signup__row">
                <input
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
              </div>
              <div
                className={
                  "signup__msg " +
                  (status === "ok" ? "ok" : status === "err" ? "err" : "")
                }
                role="status"
                aria-live="polite"
              >
                {message}
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div className="footer__left">
              &copy; Manifold Labs Incorporated
            </div>
            <div className="footer__center">Made with &lt;3 in San Francisco</div>
            <div className="footer__right">Est. 2026</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
