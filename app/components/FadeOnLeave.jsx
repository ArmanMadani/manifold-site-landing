"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onLeavePopState } from "./LeaveGate";

// Keep in sync with the leave fade in globals.css
const FADE_MS = 600;

// Wraps a page that layers content over the shared dune backdrop. When an
// in-app link (or Back/Forward) leads elsewhere, it marks itself as leaving
// (CSS fades the layers out) and navigates once the fade finishes, so the
// next page picks up on the bare backdrop instead of cutting.
export default function FadeOnLeave({ className, children }) {
  const router = useRouter();
  // Not location.pathname: after a client-side navigation the URL is
  // updated only after this page's effects have run
  const here = usePathname();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let timer;
    let replaying = false;

    // Capture phase, so this runs before next/link's own handler, which
    // skips navigating when the event is already defaultPrevented
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === here) return;

      e.preventDefault();
      if (timer) return;
      setLeaving(true);
      timer = setTimeout(() => router.push(url.pathname + url.search + url.hash), FADE_MS);
    };

    // Back/Forward can't be delayed, but Next only renders the new page from
    // its own popstate listener, and LeaveGate's runs before it. So we hold
    // the event during the fade and replay it afterwards. The URL bar
    // updates immediately; the page follows once it has faded.
    const onPopState = (e) => {
      if (replaying) return;

      // Same page (e.g. a hash change): leave it to Next, unless we came
      // straight back mid-fade (Back then Forward). Next never saw the first
      // event, so it's still on this page; swallow this one and undo the fade.
      if (location.pathname === here) {
        if (!timer) return;
        e.stopImmediatePropagation();
        clearTimeout(timer);
        timer = undefined;
        setLeaving(false);
        return;
      }

      e.stopImmediatePropagation();
      clearTimeout(timer);
      const state = e.state;
      setLeaving(true);
      timer = setTimeout(() => {
        replaying = true;
        window.dispatchEvent(new PopStateEvent("popstate", { state }));
        replaying = false;
      }, FADE_MS);
    };

    document.addEventListener("click", onClick, true);
    const releasePopState = onLeavePopState(onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      releasePopState();
      clearTimeout(timer);
    };
  }, [router, here]);

  return (
    <div className={className} data-leaving={leaving || undefined}>
      {children}
    </div>
  );
}
