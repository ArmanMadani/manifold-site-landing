"use client";

// Back/Forward gate for FadeOnLeave. Next's router renders the new page from
// a popstate listener on window that it adds when the app mounts, and
// listeners run in the order they were added. Registering here, when this
// module first loads (before hydration), puts us ahead of Next, so a page
// can hold the event while it fades out. Rendered once in the root layout.
let handler = null;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", (e) => handler?.(e), true);
}

// Route popstate events to `fn` until the returned cleanup runs
export function onLeavePopState(fn) {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
}

export default function LeaveGate() {
  return null;
}
