"use client";

import { useState } from "react";

function ChevronIcon({ open }) {
  return (
    <svg
      className={"collapse-chevron" + (open ? " open" : "")}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const [aboutOpen, setAboutOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
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

            <div className="collapse-group">
              <div className="collapse-item">
                <button
                  className="collapse-trigger"
                  onClick={() => setAboutOpen((o) => !o)}
                  aria-expanded={aboutOpen}
                >
                  <span>about:</span>
                  <ChevronIcon open={aboutOpen} />
                </button>
                <div className={"collapsible" + (aboutOpen ? " open" : "")}>
                  <div className="collapsible__inner">
                    <div className="copy">
                      <p>
                        manifold labs is an ai research lab dedicated to exploring
                        human-ai interaction. our goals are:
                      </p>
                      <ol>
                        <li>
                          to make agent use broadly accessible and economically viable
                        </li>
                        <li>
                          to make agents safe and effective in highly-regulated domains
                        </li>
                        <li>
                          to reduce barriers to open-source and local model usage
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              <div className="collapse-item">
                <button
                  className="collapse-trigger"
                  onClick={() => setProjectsOpen((o) => !o)}
                  aria-expanded={projectsOpen}
                >
                  <span>projects:</span>
                  <ChevronIcon open={projectsOpen} />
                </button>
                <div className={"collapsible" + (projectsOpen ? " open" : "")}>
                  <div className="collapsible__inner">
                    <p className="coming-soon">&gt;&gt;&gt;&nbsp;&nbsp;coming soon</p>
                  </div>
                </div>
              </div>

              <div className="collapse-item">
                <button
                  className="collapse-trigger"
                  onClick={() => setUpdatesOpen((o) => !o)}
                  aria-expanded={updatesOpen}
                >
                  <span>get updates:</span>
                  <ChevronIcon open={updatesOpen} />
                </button>
                <div className={"collapsible" + (updatesOpen ? " open" : "")}>
                  <div className="collapsible__inner">
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
              </div>
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
