"use client";

import { useState } from "react";
import ShinyButton from "./ShinyButton";

// Formspree form for blog subscribers (managed at formspree.io). Posted as
// JSON, same as the contact form, so our own validation and states apply.
const ENDPOINT = "https://formspree.io/f/mzedvjqv";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(email) {
  if (!email) return "Please enter your email.";
  if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
  return "";
}

export default function SubscribeForm() {
  // idle | sending | sent | error
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  // Errors only show after the first submit attempt, then update live
  const [attempted, setAttempted] = useState(false);

  const onChange = (e) => {
    if (attempted) setError(validate(e.currentTarget.email.value.trim()));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();

    const found = validate(email);
    setAttempted(true);
    setError(found);
    if (found) {
      form.email.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          _subject: `New blog subscriber: ${email}`,
          // Honeypot: hidden from people; Formspree drops anything that fills it
          _gotcha: form._gotcha.value,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const fieldError = json.errors?.find((e) => e.field === "email");
        if (fieldError) {
          setError(fieldError.message);
          setStatus("idle");
          return;
        }
        throw new Error(
          json.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`
        );
      }
      setStatus("sent");
    } catch (err) {
      console.error("Subscribe form error:", err);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="subscribe__status" role="status">
        You’re subscribed. New posts will arrive in your inbox.
      </p>
    );
  }

  return (
    <form
      className="subscribe-form"
      onSubmit={onSubmit}
      onChange={onChange}
      noValidate
    >
      <label htmlFor="subscribe-email" className="sr-only">
        Email (required)
      </label>
      <input
        id="subscribe-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email"
        required
        aria-required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "subscribe-error" : undefined}
      />
      <input
        type="text"
        name="_gotcha"
        className="contact-form__honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <ShinyButton type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Subscribing…" : "Subscribe"}
      </ShinyButton>
      {error && (
        <p id="subscribe-error" className="subscribe__error">
          {error}
        </p>
      )}
      {status === "error" && (
        <p className="subscribe__error" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
