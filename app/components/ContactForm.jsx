"use client";

import { useState } from "react";
import ShinyButton from "./ShinyButton";

const EMAIL = "contact@manifoldlabs.app";

// Formspree form (managed at formspree.io), delivering to EMAIL. Posted as
// JSON per their AJAX guide so our own validation and states stay in charge.
const ENDPOINT = "https://formspree.io/f/xyekpnld";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns { field: message } for every invalid field; empty when valid
function validate(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = "Please enter your name.";
  if (!data.company?.trim()) errors.company = "Please enter your company.";
  if (!data.email?.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(data.email.trim()))
    errors.email = "Please enter a valid email address.";
  return errors;
}

export default function ContactForm() {
  // idle | sending | sent | error
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  // Errors only show after the first submit attempt, then update live
  const [attempted, setAttempted] = useState(false);

  const onChange = (e) => {
    if (!attempted) return;
    setErrors(validate(Object.fromEntries(new FormData(e.currentTarget))));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const found = validate(data);
    setAttempted(true);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.elements[first].focus();
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
          name: data.name.trim(),
          company: data.company.trim(),
          email: data.email.trim(),
          message: data.message.trim() || "—",
          _subject: `Website inquiry from ${data.name.trim()} (${data.company.trim()})`,
          // Honeypot: hidden from people; Formspree drops anything that fills it
          _gotcha: data._gotcha,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        // Show Formspree's field errors inline where we can
        const fieldErrors = {};
        for (const { field, message } of json.errors ?? []) {
          if (field) fieldErrors[field] = message;
        }
        if (Object.keys(fieldErrors).length) {
          setErrors(fieldErrors);
          setStatus("idle");
          return;
        }
        throw new Error(
          json.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`
        );
      }
      form.reset();
      setAttempted(false);
      setStatus("sent");
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked; the mailto link still works
    }
  };

  return (
    <>
      {status === "sent" ? (
        <p className="contact__status" role="status">
          Message sent. We’ll be in touch shortly.
        </p>
      ) : (
        <form
          className="contact-form"
          onSubmit={onSubmit}
          onChange={onChange}
          noValidate
        >
          <Field
            name="name"
            label="Name"
            autoComplete="name"
            required
            error={errors.name}
            order={1}
          />
          <Field
            name="company"
            label="Company"
            autoComplete="organization"
            required
            error={errors.company}
            order={2}
          />
          <Field
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            error={errors.email}
            full
            order={3}
          />
          <Field
            name="message"
            label="What are you reaching out about?"
            placeholder="[Optional] What are you reaching out about?"
            multiline
            full
            order={4}
          />
          <input
            type="text"
            name="_gotcha"
            className="contact-form__honey"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <div
            className="contact-form__actions is-full contact-pan"
            style={{ "--i": 5 }}
          >
            <ShinyButton type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send message"}
            </ShinyButton>
            {status === "error" && (
              <p className="contact__error" role="alert">
                Something went wrong. Please email us directly.
              </p>
            )}
          </div>
        </form>
      )}

      <div className="contact__divider contact-pan" style={{ "--i": 6 }}>
        <span>or email directly</span>
      </div>

      <div className="contact__email contact-pan" style={{ "--i": 7 }}>
        <a href={`mailto:${EMAIL}`} className="panel__link">
          {EMAIL}
        </a>
        <button type="button" className="contact__copy" onClick={copyEmail}>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="5" y="5" width="9" height="9" rx="1" />
            <path d="M3 11H2a1 1 0 01-1-1V2a1 1 0 011-1h8a1 1 0 011 1v1" />
          </svg>
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  error,
  full,
  multiline,
  order,
  ...props
}) {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    placeholder: label,
    required,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    ...props,
  };
  return (
    <div
      className={"contact-form__field contact-pan" + (full ? " is-full" : "")}
      style={{ "--i": order }}
    >
      <label htmlFor={name} className="sr-only">
        {label}
        {required && " (required)"}
      </label>
      {multiline ? <textarea rows={4} {...shared} /> : <input type={type} {...shared} />}
      {error && (
        <p id={errorId} className="contact-form__error">
          {error}
        </p>
      )}
    </div>
  );
}
