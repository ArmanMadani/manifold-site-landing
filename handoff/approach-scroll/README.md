# Handoff: Approach scroll graphic for /about

`approach-scroll.html` is a finished, standalone reference for a scroll-driven three-step section. It replaces the three bullets in the **Approach** section of the About page:

1. Unify and contextualize relevant datasets to make them agent-ready
2. Connect the dots between siloed software systems and/or build custom environments
3. Carry data from insights to action

Arman has reviewed and approved the design, copy, and example. Port it into the Next.js app as a component. Don't redesign it.

Open the file in a browser and scroll to see the intended behavior.

## What it does

- A sticky two-column layout. The step copy is on the left (`01 / 03` … `03 / 03`, with a progress rail you can click). A 600×600 logical stage on the right scales to fit its box.
- The scroll section is `420vh` tall. Scroll progress `p` runs from 0 to 3. Each step scrubs its animation over the first 82% of its span, then holds the final state. Steps and scenes crossfade at the boundaries.
- All three steps follow one running example, **Model Risk Management** for a "Retail Card PD Scorecard" (`MRM-0142`):
  - **Step 1:** four source systems name the same model differently. They resolve into one agent-ready record.
  - **Step 2:** six systems wire into an `env · model-monitoring` environment. "Vendor models" changes from `without APIs` to `custom connector` once it is connected.
  - **Step 3:** a PSI breach insight produces three actions (memo, Jira issue, inventory update). Each moves Queued → Ready → done. The section ends with "Delivered to J. Okafor, head of model risk".
- Step 2 has small ambient "packets" on the live links. They run on a time-based `requestAnimationFrame` loop. Under `prefers-reduced-motion`, every scene jumps to its final state and the packets don't run.
- Below 860px wide, the copy stacks above the stage inside the sticky frame.

## Porting notes

1. **Component.** Make it `app/components/ApproachSteps.jsx` with `"use client"`, using the markup from the file. Move the IIFE script into a `useEffect`. Clean up the scroll and resize listeners, the `ResizeObserver`, and the rAF packet loop on unmount. Ideally, also pause the packet loop when the section is offscreen.
2. **Remove the demo scaffolding.** That means the `<title>`, the Google Fonts `<link>`, the `.backdrop` div and its CSS, and the `.outro` "End of sequence" div. The section is meant to be transparent, so the About page's own blurred grey-to-black background shows through the frosted-glass cards.
3. **Fonts.**
   - The reference uses Libre Caslon Condensed only as a stand-in. Switch `--f-sans` to the site's `var(--font-serif)` (PP Editorial New).
   - PP Editorial is only loaded at weight 400 in `app/layout.jsx`, so either drop the 700 weights (step `h3`, node names, hub, card titles) or load a heavier cut.
   - Data text uses IBM Plex Mono. Load it with `next/font/google`, or swap it for whatever mono the site uses.
4. **Token collisions.** The component defines `--ink`, `--paper`, `--muted`, `--rule` and others on `:root`. `--ink` and `--paper` already exist in `app/globals.css` with different meanings. Scope the component's tokens under a root class such as `.approach-steps` and prefix them (for example `--as-ink`) so they don't override the site's.
5. **Sticky requirements.** `.sticky` uses `position: sticky`, so no ancestor of the section can have `overflow: hidden`, `auto` or `clip`. Progress is computed from the section's `getBoundingClientRect()` against `window`. If /about scrolls inside a custom container rather than the window, change the listener and the math to match.
6. **Scroll snap conflict.** `globals.css` sets `scroll-snap-type: y mandatory` on `html:has(.panels)`, and each `.panel` is 100svh with `scroll-snap-stop: always`. If the About page uses `.panels`, mandatory snapping will jump straight past a 420vh section. Either render this section outside the panel flow, or relax snapping while it is on the page, for example `html:has(.approach-steps) { scroll-snap-type: none; }`, or `proximity`. Decide which fits the About page.
7. **Width.** The Approach text column is roughly 1070px wide. The graphic reads best with two columns, roughly a 5:7 split, so let the section break out wider than the prose column if needed. The stage scales down gracefully either way.
8. **Copy is final.** Keep the step headings, body copy, captions, and the MRM example data as written in the HTML.
