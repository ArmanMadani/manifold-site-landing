import Image from "next/image";
import Link from "next/link";
import splash from "../../dune-splash-image.jpg";
import portrait from "../YT_PROF_DP.png";
import linkedinIcon from "../linkedin-app-white-icon.webp";
import mailIcon from "../mail.svg";
import FadeOnLeave from "../components/FadeOnLeave";
import ProcessSequence from "../components/ProcessSequence";
import SiteCredit from "../components/SiteCredit";

export const metadata = {
  title: "About — Manifold",
  description: "Who we are and how Manifold works.",
};

// Each section: a heading, then paragraphs and the PROCESS marker for the
// scrolling animation
const PROCESS = "process";

const SECTIONS = [
  {
    heading: "Thesis",
    blocks: [
      "Manifold was built to bring together domain experts and experienced technologists to help financial services companies with their toughest challenges. Having worked at both leading financial technology startups and mature professional services companies, I know how difficult it can be to parse regulations, address IT guardrails, and implement frontier technology without drawing resources away from mission-critical tasks.",
      "We see a persistent “innovation gap.” Typically, this gap is addressed using suboptimal approaches: (1) generalized software (e.g., SaaS products) or (2) outsourcing the business process (e.g., hiring professional services to deliver an output).",
      "Manifold offers a new way. We are a hybrid services-to-software company. We embed deeply within your company to address innovation gaps, ideate solutions, and build durable products that deliver value consistently. While we will provide best-in-class guidance or advisory, our north star is creating bespoke agentic systems that automate workflows, minimize costs, and increase efficiency.",
    ],
  },
  {
    heading: "Approach",
    blocks: [
      "We work closely to modernize business processes starting with your data:",
      PROCESS,
      "We favor small, durable systems over sprawling platforms with the latest n-trillion parameter model. A well-scoped agent built for purpose is worth more than a solution that sits idle.",
      "We always design with compliance, model risk, and data governance in mind from the first conversation.",
    ],
  },
  {
    heading: "Connect with Us",
    blocks: [
      <>
        We are based in San Francisco and work with clients across the country.{" "}
        <Link href="/contact" className="panel__link">
          We would love to hear about how we can help your business unlock real, transformational value.
        </Link>
      </>,
    ],
  },
];

const CREDENTIALS = [
  { org: "Plaid, Inc.", role: "Senior Data Scientist – Credit Machine Learning" },
  { org: "Affirm, Inc.", role: "Lead Data Scientist – New Products" },
  {
    org: "Applied Economist for the State of California (Governor Appointed)",
    href: "https://www.gov.ca.gov/2023/04/25/governor-newsom-announces-appointments-4-25-23/",
  },
  {
    org: "Patented Inventor, Proactive Underwriting Systems (USPTO)",
    href: "https://patents.google.com/patent/US20240193681A1/",
  },
  { org: "UC Berkeley, BA Economics & Statistics" },
];

const LINKEDIN_URL = "https://www.linkedin.com/in/armanmadani/";
const EMAIL = "contact@manifoldlabs.app";

export default function About() {
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

      <FadeOnLeave>
        <div className="blog-frost" aria-hidden="true" />

        <div className="about" data-header-clear>
          <h1 className="sr-only">About</h1>

          <div className="about__column">
            {SECTIONS.map(({ heading, blocks }, i) => (
              <section key={heading} className="about__section pan-in" style={{ "--i": i }}>
                <h2 className="about__heading">{heading}</h2>
                {blocks.map((block, j) =>
                  block === PROCESS ? (
                    <ProcessSequence key={j} />
                  ) : (
                    <p key={j} className="panel__body">
                      {block}
                    </p>
                  ),
                )}
              </section>
            ))}

            <section
              className="founder pan-in"
              style={{ "--i": SECTIONS.length }}
              aria-label="Founder"
            >
              <Image
                src={portrait}
                alt="Arman Madani"
                sizes="(max-width: 720px) 96px, 184px"
                placeholder="blur"
                className="founder__photo"
              />

              <div className="founder__text">
                <h2 className="founder__name">
                  Arman Madani <span className="founder__pipe" aria-hidden="true">|</span>{" "}
                  <em className="founder__role">Founder &amp; CEO</em>
                </h2>

                <ul className="founder__credentials">
                  {CREDENTIALS.map(({ org, role, href }) => (
                    <li key={org}>
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {org}
                        </a>
                      ) : (
                        org
                      )}
                      {role && (
                        <>
                          {" | "}
                          <em>{role}</em>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="founder__links">
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <img src={linkedinIcon.src} alt="" width={18} height={18} />
                  </a>
                  <a href={`mailto:${EMAIL}`} aria-label={`Email ${EMAIL}`}>
                    <img src={mailIcon.src} alt="" width={18} height={18} />
                  </a>
                </div>
              </div>
            </section>
          </div>

          <footer className="blog-footer">
            <SiteCredit />
          </footer>
        </div>
      </FadeOnLeave>
    </main>
  );
}
