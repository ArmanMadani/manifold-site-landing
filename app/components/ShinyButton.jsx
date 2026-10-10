import Link from "next/link";

// CTA with a conic-gradient border sweep, dot speckle and inner sheen.
// Adapted from the Hyperiux "Shiny Button"; styles live in globals.css.
export default function ShinyButton({ href, children }) {
  return (
    <Link href={href} className="shiny-cta">
      <span>{children}</span>
    </Link>
  );
}
