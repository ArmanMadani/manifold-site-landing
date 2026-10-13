"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "./BrandMark";

const NAV = [
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact", accent: true },
];

// Keep in sync with the mobile breakpoint in globals.css
const MOBILE_QUERY = "(max-width: 720px)";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const firstLinkRef = useRef(null);

  // The mark always returns home. If we're already home, glide back to the
  // first panel instead of re-navigating.
  const onHomeClick = (e) => {
    setMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Close the menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // On pages that opt in with [data-header-clear], the header steps aside
  // once the page's copy scrolls up to it, rather than sitting on the text
  const headerRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame;
    const check = () => {
      frame = undefined;
      const first = document.querySelector("[data-header-clear] > :not(.sr-only)");
      const header = headerRef.current;
      if (!first || !header) return setHidden(false);
      // A little clearance, so it's gone before the text reaches it
      setHidden(first.getBoundingClientRect().top < header.getBoundingClientRect().bottom + 16);
    };
    const onScroll = () => {
      frame ??= requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    firstLinkRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    // If the viewport grows past the breakpoint, the overlay no longer applies
    const mq = window.matchMedia(MOBILE_QUERY);
    const onMq = () => !mq.matches && setMenuOpen(false);

    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="site-header"
      data-menu-open={menuOpen}
      data-hidden={(hidden && !menuOpen) || undefined}
    >
      <Link
        href="/"
        className="wordmark reveal"
        style={{ "--i": 0 }}
        onClick={onHomeClick}
        aria-label="Manifold — home"
      >
        <span className="wordmark__text">Manifold</span>
        <BrandMark className="wordmark__icon" />
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {NAV.map(({ label, href, accent }, i) => (
          <Link
            key={href}
            href={href}
            className={"site-nav__link reveal" + (accent ? " is-accent" : "")}
            style={{ "--i": i + 1 }}
          >
            {label}
          </Link>
        ))}
      </nav>

      <button
        ref={toggleRef}
        type="button"
        className="menu-toggle reveal"
        style={{ "--i": 1 }}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="menu-toggle__bar" />
        <span className="menu-toggle__bar" />
        <span className="menu-toggle__bar" />
      </button>

      <div
        id="mobile-menu"
        className="menu-overlay"
        data-open={menuOpen}
        onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}
      >
        <nav className="menu-overlay__nav" aria-label="Primary (mobile)">
          {NAV.map(({ label, href, accent }, i) => (
            <Link
              key={href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={href}
              className={"menu-overlay__link" + (accent ? " is-accent" : "")}
              style={{ "--j": i }}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
