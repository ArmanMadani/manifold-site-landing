"use client";

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

export default function SiteHeader() {
  const pathname = usePathname();

  // The mark always returns home. If we're already home, glide back to the
  // first panel instead of re-navigating.
  const onHomeClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="site-header">
      <Link
        href="/"
        className="wordmark reveal"
        style={{ "--i": 0 }}
        onClick={onHomeClick}
        aria-label="Manifold — home"
      >
        <BrandMark className="wordmark__icon" />
        <span className="wordmark__text">Manifold</span>
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
    </header>
  );
}
