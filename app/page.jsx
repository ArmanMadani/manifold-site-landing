import Image from "next/image";
import splash from "../dune-splash-image.jpg";
import PanelScroller from "./components/PanelScroller";
import ShinyButton from "./components/ShinyButton";
import SiteCredit from "./components/SiteCredit";

// Each entry is one scroll stop. Order here is scroll order; the chevron
// flips and the footer appears on whichever panel is last.
const PANELS = [
  {
    id: "intro",
    label: "Introduction",
    content: (
      <>
        <h1 className="panel__title">
          Applied AI for Ambitious Financial Services Companies
        </h1>
        <p className="panel__body">
          We deploy AI and frontier technologies safely across the financial
          services industry.
          <br className="br-wide" /> Collaborating directly with pioneers at
          leading companies to unlock transformational growth.
        </p>
        <div className="panel__cta">
          <ShinyButton href="/contact">Let’s Talk</ShinyButton>
        </div>
      </>
    ),
  },
  {
    id: "team",
    label: "Who we are",
    content: (
      <>
        <h2 className="panel__title">
          Technologists, Builders, and Owners by Trade
        </h2>
        <p className="panel__body">
          We are a team of technologists with backgrounds in: early-stage
          financial technology, mature finance-focused professional services,
          and high-level government appointments
        </p>
        <p className="panel__body">
          AI is <em>the transformational technology of this generation.</em> We
          build agentic systems that eliminate barriers to growth, minimize
          costs, and increase operational efficiency.
        </p>
        <p className="panel__body">
          We judge ourselves on value-added outcomes for our clients, not hours
          billed.
        </p>
        {/* Placeholder: will link to the blog post once it exists. */}
        <p className="panel__body">
          <span className="panel__link">
            Read more about our hybrid services-to-software approach.
          </span>
        </p>
      </>
    ),
  },
];

export default function Home() {
  return (
    <main>
      <div className="backdrop" aria-hidden="true">
        <Image
          src={splash}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          className="backdrop__image"
        />
      </div>

      <PanelScroller
        panels={PANELS}
        footer={<SiteCredit />}
      />
    </main>
  );
}
