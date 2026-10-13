// Bottom-right footer copy shared by every page
export default function SiteCredit() {
  return (
    <>
      <span className="credit__line">
        Made with{" "}
        {/* U+FE0E forces the monochrome text glyph, never the emoji */}
        <span role="img" aria-label="love">
          {"♥︎"}
        </span>{" "}
        in San Francisco
      </span>
      <span className="credit__line credit__copyright">
        © 2026 Manifold Research Labs, Inc.
      </span>
    </>
  );
}
