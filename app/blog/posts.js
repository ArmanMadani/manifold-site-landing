// Blog index data. Newest first: the first entry is the "latest post" card
// on the home page. Slugs point at /blog/<slug> (post pages come later).
export const POSTS = [
  {
    slug: "ledger-01",
    title: "[Coming Soon] Ledger-01: Agent-Ready Data Unification and Contextualization",
    tag: "AI",
    date: "2027-01-01",
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
