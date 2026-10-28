// Single source of truth for campaign copy and numbers. The UI and the
// FAQ read from here, so updating the total raised or the
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
  project: "$4 Million Building Project",
  goal: 4_000_000,
  // Running total. While it's 0 the page shows a pre-launch state pointing
  // to the banquet; enter the real figure to switch to the live meter.
  raised: 0,
  currency: "USD",
  // TODO: link to the church's online giving page (Givelify, Tithe.ly, PayPal,
  // Zeffy…). The donation form sends donors here with `amount` and
  // `frequency` query parameters.
  givingUrl: "",
  milestones: [1_000_000, 2_000_000, 3_000_000],
} as const;

// Offline ways to give, shared by the donation form and the banquet card.
export const giving = {
  zelle: "pay@maryamcolumbus.org",
  // Suggested Zelle memo so donations can be told apart from ticket payments.
  memo: "Renovation",
} as const;

export const socials = [
  { name: "Facebook", url: "https://www.facebook.com/MaryamColumbus/" },
  { name: "Instagram", url: "https://www.instagram.com/Debrebrhaneotc" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/maryamcolumbus" },
] as const;

// From the church's Candid profile URL; donors use it to find the church on
// workplace-giving platforms.
export const ein = "31-1746535";

// Online fundraising and workplace-giving pages. Leave `url` empty to show a
// platform as text only (donors search for the church by name or EIN).
export const givingPlatforms = [
  {
    name: "Candid",
    description: "Our verified nonprofit profile.",
    cta: "View profile",
    url: "https://app.candid.org/profile/7352740/saint-mary-eritrean-orthodox-tewahdo-church---columbus-oh-31-1746535",
  },
  {
    name: "Benevity",
    description: "Give through your employer’s workplace giving program.",
    cta: "Open Benevity",
    // TODO: replace with the church's own Benevity cause page if there is one.
    url: "https://benevity.org",
  },
  {
    name: "Bonterra",
    description: "Give through your employer’s workplace giving program.",
    cta: "Open Bonterra",
    // TODO: add the church's Bonterra campaign page link.
    url: "",
  },
] as const;

export const fundraisingEvent = {
  title: "Fundraising Banquet",
  date: "2026-11-14T14:00:00-05:00",
  dateLabel: "Saturday, November 14, 2026",
  timeLabel: "2:00 PM – 8:00 PM",
  venue: "Abe's Banquet Hall",
  address: "5005 Chatterton Rd, Columbus, OH 43232",
  price: 100,
  highlights: ["Food", "Raffles", "Fellowship", "Live Entertainment"],
  // Tickets are paid by Zelle or cash.
  payment: { zelle: giving.zelle, cash: true },
} as const;

export const givingTiers = [
  { amount: 100, name: "Friend", note: "Helps give a child a place to sit and learn." },
  { amount: 500, name: "Builder", note: "Helps build new classrooms for our children and youth." },
  { amount: 1_000, name: "Pillar", note: "Helps build a gathering hall for our whole community." },
  { amount: 5_000, name: "Cornerstone", note: "A lasting foundation for the next generation." },
] as const;

// Sections listed in the top menu, in page order.
export const navLinks = [
  { id: "why", label: "Why" },
  { id: "plan", label: "The plan" },
  { id: "progress", label: "Progress" },
  { id: "banquet", label: "Banquet" },
  { id: "give", label: "Give" },
  { id: "faq", label: "FAQ" },
] as const;

export const faqs = [
  {
    q: "What will the money build?",
    a: "New classrooms and a gathering hall come first: our current rooms are too small and crowded for everyone to sit and learn. The project also expands the sanctuary.",
  },
  {
    q: "How do I buy a banquet ticket?",
    a: `Tickets are $${fundraisingEvent.price} per person. Send payment by Zelle to ${giving.zelle}, or pay with cash.`,
  },
  {
    q: "How can I donate?",
    a: `Send your gift by Zelle to ${giving.zelle} and add "${giving.memo}" in the memo. You can also give cash in person or mail a check payable to ${church.name}.`,
  },
  {
    q: "Can I give monthly?",
    a: "Yes. Many banking apps let you schedule a Zelle payment to repeat every month.",
  },
  {
    q: "Can I give through my employer?",
    a: `If your employer offers workplace giving through Benevity or Bonterra, search for Saint Mary Eritrean Orthodox Tewahdo Church or our EIN, ${ein}. Ask your employer whether they also match gifts.`,
  },
  {
    q: "Where is the church?",
    a: `${church.address.street}, ${church.address.city}, ${church.address.region} ${church.address.postal}.`,
  },
] as const;

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const formatUSD = (n: number) => usd.format(n);

/** "$1.25M" style short form for big headline numbers. */
export function formatShortUSD(n: number) {
  if (n >= 1_000_000) return `$${+(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${+(n / 1_000).toFixed(1)}K`;
  return usd.format(n);
}
