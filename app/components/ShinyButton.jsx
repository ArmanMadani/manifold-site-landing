import Link from "next/link";

// CTA with a conic-gradient border sweep, dot speckle and inner sheen.
// Adapted from the Hyperiux "Shiny Button"; styles live in globals.css.
// With an href it's a link; without one it's a <button> (e.g. form submit).
export default function ShinyButton({ href, children, ...props }) {
  if (href) {
    return (
      <Link href={href} className="shiny-cta" {...props}>
        <span>{children}</span>
      </Link>
    );
  }
  return (
    <button className="shiny-cta" {...props}>
      <span>{children}</span>
    </button>
  );
}
