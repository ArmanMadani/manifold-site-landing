"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Keep in sync with the leave fade in globals.css
const FADE_MS = 600;

// Wraps a page that layers content over the shared dune backdrop. When an
// in-app link leads elsewhere, it marks itself as leaving (CSS fades the
// layers out) and navigates once the fade finishes, so the next page picks
// up on the bare backdrop instead of cutting.
export default function FadeOnLeave({ className, children }) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let timer;
    // Capture phase, so this runs before next/link's own handler, which
    // skips navigating when the event is already defaultPrevented
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;

      e.preventDefault();
      if (timer) return;
      setLeaving(true);
      timer = setTimeout(() => router.push(url.pathname + url.search + url.hash), FADE_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className={className} data-leaving={leaving || undefined}>
      {children}
    </div>
  );
}
