// Blog index data. Newest first: the first entry is the "latest post" card
// on the home page. Slugs point at /blog/<slug> (post pages come later).
export const POSTS = [
  {
    slug: "cash-flow-smoothing",
    title: "The Unreasonable Efficacy of Cash Flow Smoothing: FinTech and A Lesson in Comms",
    tag: "Economics",
    date: "2026-10-11",
  },
  {
    slug: "genius-and-clarity",
    title: "GENIUS and Clarity: Our Approach to Regulatory Preparedness",
    tag: "Perspectives",
    date: "2026-10-11",
  },
  {
    slug: "great-risk-fine-margin",
    title: "A Game of Great Risk and Fine Margin",
    tag: "Perspectives",
    date: "2026-10-11",
  },
  {
    slug: "the-spiky-frontier",
    title: "The Spiky Frontier: Unique Challenges in Financial Services",
    tag: "AI",
    date: "2026-10-11",
  },
  {
    slug: "services-3-0",
    title: "Services 3.0: New Models, Old Models, and Pervasive Incentive Misalignment",
    tag: "Economics",
    date: "2026-10-11",
  },
  {
    slug: "announcing-manifold",
    title: "Announcing Manifold: An Applied AI Company, Built for the Toughest Problems",
    tag: "Announcements",
    date: "2026-10-11",
  },
];

// Tag dot colors come from the brand mark's squares
export const TAG_COLORS = {
  Economics: "#3b86a4",
  Perspectives: "#eb9e2c",
  AI: "#d8312a",
  Announcements: "#243370",
};

// AP style: "Oct. 11, 2026"; March–July are never abbreviated
const MONTHS = [
  "Jan.", "Feb.", "March", "April", "May", "June",
  "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec.",
];

export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
