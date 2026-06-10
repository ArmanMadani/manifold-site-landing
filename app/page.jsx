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
            <div>
              <h1 className="wordmark">Manifold Labs</h1>
            </div>

            <div className="copy">
              <p>Personal finances can be complicated. But they don&rsquo;t have to be.</p>

              <p>
                We understand that everyone has a unique relationship with their
                money. That&rsquo;s why inflexible financial interfaces and
                misaligned AI models can feel frustrating.
              </p>

              <p className="intro">
                Introducing Manifold Labs. We&rsquo;re improving the financial
                reasoning capabilities of AI models. We envision a future in which
                agentic consumer finance is safe, secure, and effective for
                everyone.
              </p>

              <p>
                There&rsquo;s much to build &mdash; from a deeper, native
                understanding of transaction streams, to comprehensive evaluation
                suites, to safety protocols that keep you in control. We hope
                you&rsquo;ll be able to use our apps to interact with your money in
                novel ways.
              </p>

              <p>We&rsquo;re launching soon! Subscribe for updates.</p>

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
                    {status === "loading" ? "Subscribing\u2026" : "Subscribe"}
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
