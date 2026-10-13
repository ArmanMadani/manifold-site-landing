"use client";

import { useEffect, useRef } from "react";

// Sticky scrollytelling for the About page's Approach section: a copy rail on
// the left, a 600×600 stage on the right that scales to fit, one scene per
// step, scrubbed by scroll. Ported from "Manifold Process Sequence.html".
// Everything the animation touches is rendered here; the effect only sets
// styles and classes, so React stays the sole owner of the DOM tree.

const CAPTIONS = [
  "Four systems, four names for the same model, one record an agent can reason about.",
  "Six systems wired into one environment built for the task.",
  "One finding becomes three actions, approved and logged.",
];

const STEPS = [
  {
    title: "Unify and contextualize your data",
    body: [
      "We pull the relevant datasets together and resolve the same customer, account, or model across every system it lives in.",
      "Then we document what each field means, where it came from, and how fresh it is, so an agent can use it without guessing.",
    ],
  },
  {
    title: "Connect the dots between siloed systems",
    body: [
      "Your core, loan system, CRM, and vendor portals were never built to talk. We wire them together, including the ones without APIs.",
      "Where a task needs it, we build a custom environment: the right tools, scoped access, and your own history to test against before anything reaches production.",
    ],
  },
  {
    title: "Carry data from insights to action",
    body: [
      "Insights are delivered to the relevant people. Agents can draft responses, write updates, and open follow-up work to the taste of your enterprise.",
    ],
  },
];

const RAIL = ["01 Unify", "02 Connect", "03 Act"];

// Scene 2: systems arranged around the agent, by angle
const NODES = [
  { a: 0, n: "Inventory", t: "GRC platform" },
  { a: 60, n: "Warehouse", t: "Snowflake" },
  { a: 120, n: "Vendor models", t: "without APIs", t2: "custom connector" },
  { a: 180, n: "Model repo", t: "GitHub" },
  { a: 240, n: "Policy library", t: "SharePoint" },
  { a: 300, n: "Issue tracker", t: "Jira" },
];

const ACTIONS = [
  { top: 244, title: "Draft the monitoring memo", desc: "Breach summary and segment charts for the model owner", done: "Sent" },
  { top: 318, title: "Log a model issue", desc: "Medium severity, linked to finding F-3, in Jira", done: "Logged" },
  { top: 392, title: "Update the model inventory", desc: "Status set to under review, revalidation due Q1", done: "Written" },
];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (t, a, b) => ease(clamp((t - a) / (b - a)));

export default function ProcessSequence() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => [...root.querySelectorAll(s)];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [];

    /* ---------- stage scaling ---------- */
    const box = $(".ps-box");
    const stage = $(".ps-stage");
    // Inset so the diagram clears the panel's border
    const PAD = 24;
    const fit = () => {
      const r = box.getBoundingClientRect();
      const s = Math.min((r.width - PAD * 2) / 600, (r.height - PAD * 2) / 600);
      stage.style.setProperty("--s", Math.max(0.3, s));
    };
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    fit();
    cleanups.push(() => ro.disconnect());

    /* ---------- scene 1 ---------- */
    const s1 = {
      hls: $$(".ps-sc0 .hl"),
      srcs: $$(".ps-sc0 .src"),
      chips: $$(".ps-sc0 .chip"),
      wires: $$(".ps-sc0 .w1"),
      entity: $(".ps-entity"),
      fields: $$(".ps-entity .field"),
      foot: $(".ps-entity .foot"),
      pill: $(".ps-entity .pill"),
    };
    // delta from each source card's centre to its chip's centre
    const deltas = s1.srcs.map((c, i) => {
      const ch = s1.chips[i];
      const cx = c.offsetLeft + c.offsetWidth / 2;
      const cy = c.offsetTop + c.offsetHeight / 2;
      const tx = ch.offsetLeft + ch.offsetWidth / 2;
      const ty = ch.offsetTop + ch.offsetHeight / 2;
      return [tx - cx, ty - cy];
    });

    function scene1(t) {
      s1.hls.forEach((h, i) => {
        const v = seg(t, 0.05 + i * 0.018, 0.15 + i * 0.018);
        h.style.setProperty("--h", v.toFixed(3));
        h.classList.toggle("lit", v > 0.9);
      });
      const m = seg(t, 0.36, 0.62);
      const fade = seg(t, 0.46, 0.64);
      s1.srcs.forEach((c, i) => {
        c.style.transform = `translate(${deltas[i][0] * m}px, ${deltas[i][1] * m}px) scale(${1 - 0.62 * m})`;
        c.style.opacity = 1 - fade;
        c.style.visibility = fade >= 1 ? "hidden" : "visible";
      });
      const chipO = seg(t, 0.54, 0.68);
      s1.chips.forEach((c) => (c.style.opacity = chipO));
      const w = seg(t, 0.6, 0.78);
      s1.wires.forEach((p) => (p.style.strokeDashoffset = 1 - w));
      const e = seg(t, 0.55, 0.76);
      s1.entity.style.opacity = e;
      s1.entity.style.transform = `translateY(${(1 - e) * 16}px) scale(${0.96 + 0.04 * e})`;
      s1.fields.forEach((f, i) => {
        const v = seg(t, 0.66 + i * 0.055, 0.78 + i * 0.055);
        f.style.opacity = v;
        f.style.transform = `translateX(${(1 - v) * -8}px)`;
      });
      s1.foot.style.opacity = seg(t, 0.88, 0.98);
      s1.pill.style.opacity = seg(t, 0.9, 1);
    }

    /* ---------- scene 2 ---------- */
    const C = { x: 300, y: 300 };
    const FR = { hw: 92, hh: 135 };
    const nodeEls = $$(".ps-sc1 .node");
    const lineEls = $$(".ps-links line");
    const portEls = $$(".ps-ports circle");
    const pktEls = $$(".ps-packets circle");
    const s2 = NODES.map((d, i) => {
      const rad = (d.a * Math.PI) / 180;
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);
      const s = Math.min(FR.hw / Math.abs(dx || 1e-6), FR.hh / Math.abs(dy || 1e-6));
      return {
        el: nodeEls[i],
        line: lineEls[i],
        port: portEls[i],
        pk: pktEls[i],
        dx,
        dy,
        px: C.x + dx * s,
        py: C.y + dy * s,
        draw: 0,
        x: 0,
        y: 0,
      };
    });
    const frame = $(".ps-frame");
    const envlabel = $(".envlabel");
    const hub = $(".hub");
    const tools = $$(".tools div");

    function scene2(t) {
      frame.style.strokeDashoffset = 1 - seg(t, 0.16, 0.36);
      envlabel.style.opacity = seg(t, 0.3, 0.4);
      const h = seg(t, 0.26, 0.4);
      hub.style.opacity = h;
      hub.style.transform = `scale(${0.7 + 0.3 * h})`;
      s2.forEach((n, i) => {
        n.el.style.opacity = seg(t, i * 0.025, 0.14 + i * 0.025);
        const r = 246 - 16 * seg(t, 0.3 + i * 0.035, 0.48 + i * 0.035);
        n.x = C.x + n.dx * r;
        n.y = C.y + n.dy * r;
        n.el.style.left = n.x + "px";
        n.el.style.top = n.y + "px";
        n.line.setAttribute("x1", n.x);
        n.line.setAttribute("y1", n.y);
        n.line.setAttribute("x2", n.px);
        n.line.setAttribute("y2", n.py);
        n.port.setAttribute("cx", n.px);
        n.port.setAttribute("cy", n.py);
        n.draw = seg(t, 0.34 + i * 0.04, 0.48 + i * 0.04);
        n.line.style.strokeDashoffset = 1 - n.draw;
        n.port.style.opacity = n.draw >= 1 ? 1 : 0;
        n.el.classList.toggle("on", n.draw >= 1);
      });
      tools.forEach((d, i) => {
        const v = seg(t, 0.64 + i * 0.05, 0.76 + i * 0.05);
        d.style.opacity = v;
        d.style.transform = `translateY(${(1 - v) * 6}px)`;
      });
    }

    // ambient packets once a link is live (time-based)
    let sceneIdx = 0;
    let packetFrame;
    function packets(now) {
      if (sceneIdx === 1 && !reduce) {
        s2.forEach((n, i) => {
          if (n.draw < 1) {
            n.pk.style.opacity = 0;
            return;
          }
          let f = (now / 1700 + i * 0.37) % 1;
          if (i % 2) f = 1 - f; // alternate direction: reads vs. write-backs
          n.pk.setAttribute("cx", n.x + (n.px - n.x) * f);
          n.pk.setAttribute("cy", n.y + (n.py - n.y) * f);
          n.pk.style.opacity = Math.sin(Math.PI * f).toFixed(3);
        });
      }
      packetFrame = requestAnimationFrame(packets);
    }
    packetFrame = requestAnimationFrame(packets);
    cleanups.push(() => cancelAnimationFrame(packetFrame));

    /* ---------- scene 3 ---------- */
    const s3 = {
      insight: $(".ps-insight"),
      ev: $$(".ps-insight .ev span"),
      rec: $(".ps-insight .rec"),
      spine: $(".ps-spine"),
      acts: $$(".ps-sc2 .act"),
      approve: $(".approve"),
    };
    function scene3(t) {
      const o = seg(t, 0, 0.16);
      s3.insight.style.opacity = o;
      s3.insight.style.transform = `translateY(${(1 - o) * -12}px)`;
      s3.ev.forEach((e, i) => (e.style.opacity = seg(t, 0.1 + i * 0.04, 0.2 + i * 0.04)));
      s3.rec.style.opacity = seg(t, 0.24, 0.34);
      s3.spine.style.strokeDashoffset = 1 - seg(t, 0.3, 0.62);
      s3.acts.forEach((a, i) => {
        const v = seg(t, 0.34 + i * 0.05, 0.46 + i * 0.05);
        a.style.opacity = v;
        a.style.transform = `translateX(${(1 - v) * 14}px)`;
        // Status text comes from CSS, keyed off these classes
        const st = t > 0.74 + i * 0.07 ? "done" : t > 0.5 + i * 0.05 ? "ready" : "";
        const p = a.querySelector(".status");
        p.classList.toggle("ready", st === "ready");
        p.classList.toggle("done", st === "done");
      });
      const ap = seg(t, 0.6, 0.7);
      s3.approve.style.opacity = ap;
      s3.approve.style.transform = `scale(${0.97 + 0.03 * ap})`;
    }

    /* ---------- scroll driver ---------- */
    const steps = $$(".step");
    const scenes = $$(".scene");
    const btns = $$(".rail button");
    const fills = $$(".rail .fill");
    const cap = $(".caption");
    const render = [scene1, scene2, scene3];
    function progress() {
      const r = root.getBoundingClientRect();
      const total = r.height - innerHeight;
      return total > 0 ? clamp(-r.top / total) * 3 : 0;
    }
    let ran = false;
    let frameReq;
    function update() {
      frameReq = undefined;
      const p = progress();
      const idx = Math.min(2, Math.floor(p));
      if (idx !== sceneIdx || !ran) {
        sceneIdx = idx;
        steps.forEach((s, i) => s.classList.toggle("on", i === idx));
        scenes.forEach((s, i) => s.classList.toggle("on", i === idx));
        btns.forEach((b, i) => {
          b.classList.toggle("on", i === idx);
          b.setAttribute("aria-current", i === idx ? "step" : "false");
        });
        cap.textContent = CAPTIONS[idx];
        ran = true;
      }
      fills.forEach((f, i) => (f.style.transform = `scaleX(${clamp((p - i) / 0.82)})`));
      // each step scrubs over the first 82% of its scroll span, then holds
      render.forEach((fn, i) => fn(reduce ? (i <= idx ? 1 : 0) : clamp((p - i) / 0.82)));
    }
    const req = () => {
      frameReq ??= requestAnimationFrame(update);
    };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    cleanups.push(() => {
      removeEventListener("scroll", req);
      removeEventListener("resize", req);
      cancelAnimationFrame(frameReq);
    });

    btns.forEach((b, i) => {
      const onClick = () => {
        const total = root.offsetHeight - innerHeight;
        const top = root.getBoundingClientRect().top + scrollY + total * (i / 3) + (i ? 4 : 0);
        scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      };
      b.addEventListener("click", onClick);
      cleanups.push(() => b.removeEventListener("click", onClick));
    });

    update();
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section ref={rootRef} className="process" aria-label="How we work, step by step">
      <div className="sticky">
        <div className="copy">
          <div className="steps">
            {STEPS.map(({ title, body }, i) => (
              <article key={title} className={"step" + (i === 0 ? " on" : "")}>
                <div className="count">
                  <b>{String(i + 1).padStart(2, "0")}</b> / 03
                </div>
                <h3>{title}</h3>
                {body.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </article>
            ))}
          </div>
          <nav className="rail" aria-label="Steps">
            {RAIL.map((label, i) => (
              <button key={label} type="button" className={i === 0 ? "on" : undefined}>
                <span>{label}</span>
                <span className="track">
                  <span className="fill" />
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="figure">
          <div className="ps-box">
            <div className="ps-stage" role="img" aria-label="Animated diagram of the current step">
              {/* SCENE 1: unify */}
              <div className="scene ps-sc0 on">
                <svg viewBox="0 0 600 600" aria-hidden="true">
                  <g fill="none" stroke="var(--accent)" strokeWidth="1.25">
                    <path className="w1" pathLength="1" d="M87 56 L210 200" />
                    <path className="w1" pathLength="1" d="M513 56 L390 200" />
                    <path className="w1" pathLength="1" d="M87 546 L210 400" />
                    <path className="w1" pathLength="1" d="M513 546 L390 400" />
                  </g>
                </svg>

                <div className="chip" style={{ left: 18, top: 40 }}>
                  <i />
                  Inventory
                </div>
                <div className="chip" style={{ left: 444, top: 40 }}>
                  <i />
                  Monitoring
                </div>
                <div className="chip" style={{ left: 18, top: 530 }}>
                  <i />
                  Validation
                </div>
                <div className="chip" style={{ left: 444, top: 530 }}>
                  <i />
                  Model repo
                </div>

                <div className="card entity ps-entity" style={{ left: 120, top: 128, width: 360, opacity: 0 }}>
                  <div className="top">
                    <span>MODEL · MRM-0142</span>
                    <span className="pill blue">agent-ready</span>
                  </div>
                  <div className="name">Retail Card PD Scorecard</div>
                  <div className="fields">
                    <div className="field">
                      <span className="f">risk_tier</span>
                      <span className="v">Tier 1</span>
                      <span className="p">Material model, per inventory</span>
                    </div>
                    <div className="field">
                      <span className="f">psi_sep</span>
                      <span className="v neg">0.27</span>
                      <span className="p">Score drift vs. dev sample; policy limit 0.25</span>
                    </div>
                    <div className="field">
                      <span className="f">ks_sep</span>
                      <span className="v">0.38</span>
                      <span className="p">Down from 0.44 at last validation</span>
                    </div>
                    <div className="field">
                      <span className="f">open_findings</span>
                      <span className="v">2</span>
                      <span className="p">From the 2025 validation report</span>
                    </div>
                  </div>
                  <div className="foot">4 sources resolved · thresholds from MRM policy · refreshed monthly</div>
                </div>

                <div className="card src" style={{ left: 18, top: 22, width: 240 }}>
                  <div className="k">
                    <span>Model inventory</span>
                    <span>GRC</span>
                  </div>
                  <div className="rows">
                    <div>
                      <span className="lab">model_id</span>
                      <span className="hl">MRM-0142</span>
                    </div>
                    <div>
                      <span className="lab">name</span>
                      <span className="hl">Retail Card PD</span>
                    </div>
                    <div>
                      <span className="lab">risk_tier</span>
                      <span>1</span>
                    </div>
                    <div>
                      <span className="lab">owner</span>
                      <span>Consumer Risk</span>
                    </div>
                  </div>
                </div>

                <div className="card src" style={{ left: 342, top: 30, width: 240 }}>
                  <div className="k">
                    <span>Monitoring run</span>
                    <span>Sep 2026</span>
                  </div>
                  <div className="rows">
                    <div>
                      <span className="lab">model</span>
                      <span className="hl">card_pd_v3_2</span>
                    </div>
                    <div>
                      <span className="lab">psi</span>
                      <span className="neg">0.27</span>
                    </div>
                    <div>
                      <span className="lab">ks</span>
                      <span>0.38</span>
                    </div>
                    <div>
                      <span className="lab">gini</span>
                      <span>0.51</span>
                    </div>
                  </div>
                </div>

                <div className="card src" style={{ left: 18, top: 338, width: 254 }}>
                  <div className="k">
                    <span>Validation report</span>
                    <span>2025 · PDF</span>
                  </div>
                  <div className="quote">
                    “Finding F-3: <span className="hl">Card PD v3.2</span> rank-orders thin-file applicants less
                    reliably. Monitor drift in this segment quarterly.”
                  </div>
                </div>

                <div className="card src" style={{ left: 342, top: 356, width: 240 }}>
                  <div className="k">
                    <span>Model repo</span>
                    <span>Git</span>
                  </div>
                  <div className="rows">
                    <div>
                      <span className="lab">repo</span>
                      <span>
                        risk/<span className="hl">card-pd</span>
                      </span>
                    </div>
                    <div>
                      <span className="lab">tag</span>
                      <span className="hl">v3.2.1</span>
                    </div>
                    <div>
                      <span className="lab">deployed_to</span>
                      <span>scoring-svc</span>
                    </div>
                    <div>
                      <span className="lab">last_commit</span>
                      <span>Jun 14</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SCENE 2: connect */}
              <div className="scene ps-sc1">
                <svg viewBox="0 0 600 600" aria-hidden="true">
                  <rect
                    className="ps-frame"
                    x="208"
                    y="165"
                    width="184"
                    height="270"
                    rx="14"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    pathLength="1"
                  />
                  <g className="ps-links" stroke="var(--ink)" strokeWidth="1.25" fill="none">
                    {NODES.map(({ n }) => (
                      <line key={n} pathLength="1" />
                    ))}
                  </g>
                  <g className="ps-ports" fill="var(--accent)">
                    {NODES.map(({ n }) => (
                      <circle key={n} r="3.5" />
                    ))}
                  </g>
                  <g className="ps-packets" fill="var(--accent)">
                    {NODES.map(({ n }) => (
                      <circle key={n} r="3" />
                    ))}
                  </g>
                </svg>
                <div className="envlabel">env · model-monitoring</div>
                <div className="hub">Agent</div>
                <div className="tools">
                  <div>compute_psi()</div>
                  <div>backtest()</div>
                  <div>check_policy()</div>
                  <div>write_back()</div>
                  <div className="replay">tested on 24 months of past monitoring runs</div>
                </div>
                {NODES.map(({ n, t, t2 }) => (
                  <div key={n} className="node">
                    <div className="n">{n}</div>
                    {t2 ? (
                      <div className="t">
                        <span className="t-off">{t}</span>
                        <span className="t-on">{t2}</span>
                      </div>
                    ) : (
                      <div className="t">{t}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* SCENE 3: act */}
              <div className="scene ps-sc2">
                <svg viewBox="0 0 600 600" aria-hidden="true">
                  <path
                    className="ps-spine"
                    pathLength="1"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.25"
                    d="M40 214 V501 M40 274 H62 M40 348 H62 M40 422 H62 M40 501 H62"
                  />
                </svg>
                <div className="card ps-insight" style={{ opacity: 0 }}>
                  <div className="k">
                    <span>Insight · MRM-0142</span>
                    <span>from 4 sources</span>
                  </div>
                  <h4>Card PD drift breached policy in September, driven by thin-file applicants.</h4>
                  <div className="ev">
                    <span>PSI 0.27 &gt; 0.25</span>
                    <span>Tier 1 model</span>
                    <span>finding F-3</span>
                    <span>MRM policy §4.2</span>
                  </div>
                  <div className="rec">
                    <span className="mono">Recommend</span>
                    <span>Escalate and move up targeted revalidation</span>
                  </div>
                </div>
                {ACTIONS.map(({ top, title, desc, done }) => (
                  <div key={title} className="card act" style={{ top }}>
                    <div>
                      <div className="tt">{title}</div>
                      <div className="dd">{desc}</div>
                    </div>
                    <span className="pill status" data-done={done} />
                  </div>
                ))}
                <div className="approve">
                  <span className="tick">✓</span>
                  <div>
                    <div className="tt">Delivered to J. Okafor, head of model risk</div>
                    <div className="dd">Approved 10:42 AM · each action linked to its evidence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Filled in by the effect as the step changes */}
          <div className="caption" aria-live="polite" />
        </div>
      </div>
    </section>
  );
}
