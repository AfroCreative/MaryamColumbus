// Single source of truth for campaign copy and numbers. The UI and the
// fly-through waypoints read from here, so updating the total raised or the
// giving links never requires touching components.

export const church = {
  name: "St. Mary Eritrean Orthodox Tewahdo Church",
  shortName: "St. Mary",
  parish: "Debre Brhan",
  parishGeez: "ደብረ ብርሃን ቅድስት ማርያም",
  address: { street: "1415 Sunbury Rd", city: "Columbus", region: "OH", postal: "43219" },
} as const;

export const campaign = {
  name: "Building a House of Light",
  project: "$4 Million Renovation Project",
  goal: 4_000_000,
  // TODO: replace with the real running total before launch.
  raised: 1_250_000,
  currency: "USD",
  // TODO: link to the church's online giving page (Givelify, Tithe.ly, PayPal,
  // Zeffy…). The donation form sends donors here with `amount` and
  // `frequency` query parameters.
  givingUrl: "",
  milestones: [1_000_000, 2_000_000, 3_000_000],
} as const;

export const fundraisingEvent = {
  title: "Fundraising Banquet",
  date: "2026-11-14T14:00:00-05:00",
  dateLabel: "Saturday, November 14, 2026",
  timeLabel: "2:00 PM – 8:00 PM",
  venue: "Abe's Banquet Hall",
  address: "5005 Chatterton Rd, Columbus, OH 43232",
  price: 100,
  highlights: ["Food", "Raffles", "Fellowship", "Live Entertainment"],
  // TODO: link to ticket sales, or leave empty to hide the button.
  ticketUrl: "",
} as const;

export const givingTiers = [
  { amount: 100, name: "Friend", note: "The price of a banquet seat, given toward the building." },
  { amount: 500, name: "Builder", note: "Helps renew the sanctuary where we gather to pray." },
  { amount: 1_000, name: "Pillar", note: "Builds room for fellowship, feasts and family milestones." },
  { amount: 5_000, name: "Cornerstone", note: "A lasting foundation for the church and community." },
] as const;

export type WaypointId = "hero" | "vision" | "need" | "impact" | "give";

// Each waypoint is a scroll section. `at` is the normalized position (0–1)
// along the fly-through where the camera should be framing that part of the
// church. The background renderer uses these as keyframe anchors.
export const waypoints: { id: WaypointId; label: string; at: number }[] = [
  { id: "hero", label: "Approach across the grounds", at: 0 },
  { id: "vision", label: "Arriving at the entrance", at: 0.25 },
  { id: "need", label: "The icon above the doors", at: 0.5 },
  { id: "impact", label: "Through the doors", at: 0.75 },
  { id: "give", label: "The finished church", at: 1 },
];

export const navLabels: Record<WaypointId, string> = {
  hero: "Welcome",
  vision: "Vision",
  need: "Progress",
  impact: "Impact",
  give: "Give",
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const formatUSD = (n: number) => usd.format(n);

/** "$1.25M" style short form for big headline numbers. */
export function formatShortUSD(n: number) {
  if (n >= 1_000_000) return `$${+(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${+(n / 1_000).toFixed(1)}K`;
  return usd.format(n);
}
