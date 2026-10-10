"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function Chevron() {
  return (
    <svg viewBox="0 0 549 333" aria-hidden="true" focusable="false">
      <path
        d="M62 62 L274.5 271 L487 62"
        fill="none"
        stroke="currentColor"
        strokeWidth="86"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full-viewport "pages" over a fixed background.
 *
 * Each panel is an empty, scroll-snapped 100svh section, so native scrolling
 * (wheel, trackpad, touch, keyboard) lands on discrete stops. The visible
 * copy for each panel is pinned to the bottom-left and crossfades as the
 * active panel changes.
 *
 * Everything that depends on "where we are" — the chevron direction and the
 * end-of-page footer — is derived from the panel count, so adding a panel
 * is just adding an entry to `panels`.
 */
export default function PanelScroller({ panels, footer }) {
  const sectionRefs = useRef([]);
  const [active, setActive] = useState(0);

  const lastIndex = panels.length - 1;
  const atEnd = active === lastIndex;

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      let nearest = 0;
      let best = Infinity;
      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(el.offsetTop - y);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      setActive(nearest);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [panels.length]);

  const onChevron = useCallback(() => {
    if (atEnd) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      sectionRefs.current[active + 1]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [active, atEnd]);

  return (
    <div className="panels reveal" style={{ "--i": 0 }}>
      {panels.map((panel, i) => (
        <section
          key={panel.id}
          id={panel.id}
          ref={(el) => (sectionRefs.current[i] = el)}
          className="panel"
          aria-label={panel.label}
        >
          <div className="panel__content" data-active={i === active}>
            {panel.content}
          </div>
        </section>
      ))}

      <button
        type="button"
        className="panel-chevron"
        data-up={atEnd}
        onClick={onChevron}
        aria-label={atEnd ? "Back to top" : "Next section"}
      >
        <Chevron />
      </button>

      {footer && (
        <footer className="panel-footer" data-active={atEnd}>
          {footer}
        </footer>
      )}
    </div>
  );
}
