import Image from "next/image";
import type { ReactNode } from "react";
import { CopyButton } from "@/components/CopyButton";
import { DonationForm } from "@/components/DonationForm";
import { EventCard } from "@/components/EventCard";
import { ProgressMeter } from "@/components/ProgressMeter";
import { SiteHeader } from "@/components/SiteHeader";
import { SocialLinks } from "@/components/SocialLinks";
import {
  campaign,
  church,
  ein,
  faqs,
  formatShortUSD,
  formatUSD,
  fundraisingEvent,
  giving,
  givingPlatforms,
  navLinks,
} from "@/lib/campaign";

const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";
const eyebrow = "text-sm font-semibold uppercase tracking-wider text-gold-ink";
const h2 = "mt-2 font-display text-4xl font-semibold leading-tight text-balance sm:text-5xl";
const lead = "mt-4 text-lg leading-relaxed text-navy/75 text-pretty";

// Small outline icons (24px grid) used on cards and chips.
const icons = {
  church: "M12 3v4m-2-2h4M5 21V11l7-4 7 4v10M9 21v-5a3 3 0 0 1 6 0v5M3 21h18",
  door: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M4 21h16M14 12h.01",
  people: "M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 9v-1a4 4 0 0 0-3-3.87M15 4.13a3 3 0 0 1 0 5.74",
  calendar: "M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  phone: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
} as const;

type IconName = keyof typeof icons;

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d={icons[name]} />
    </svg>
  );
}

function SectionHeader({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className={eyebrow}>{kicker}</p>
      <h2 className={h2}>{title}</h2>
      {children && <p className={lead}>{children}</p>}
    </div>
  );
}

const vision: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "church",
    title: "A renewed sanctuary",
    text: "A worthy home for the Divine Liturgy, the feasts and the prayers of our people.",
  },
  {
    icon: "door",
    title: "A welcoming entrance",
    text: "An arched doorway crowned by the icon of our Holy Mother, open to all of Columbus.",
  },
  { icon: "people", title: "Room to gather", text: "Space for fellowship, celebrations and a growing parish family." },
];

const impact = [
  { title: "Faith handed down", text: "Our children and grandchildren will learn the faith in a church built to last." },
  { title: "Fellowship that grows", text: "Baptisms, weddings, feasts and holidays: room for every milestone we share." },
  { title: "A light on Sunbury Road", text: "A landmark that welcomes newcomers and neighbors to the Eritrean Orthodox tradition." },
  { title: "A home that is ours", text: "A renovated church that belongs to the community, now and for generations." },
];

const renderings = [
  {
    src: "/images/facade.webp",
    w: 816,
    h: 378,
    caption: "Front entrance",
    alt: "Rendering of the church facade with arched entrance and icon",
  },
  {
    src: "/images/exterior-wide.webp",
    w: 811,
    h: 375,
    caption: "Full exterior",
    alt: "Rendering of the full church exterior seen across the parking lot",
  },
];

const candidUrl = givingPlatforms.find((g) => g.name === "Candid")?.url;

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${fundraisingEvent.venue}, ${fundraisingEvent.address}`,
)}`;

export default function Home() {
  const { street, city, region, postal } = church.address;
  const eventShort = new Date(fundraisingEvent.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  });

  const heroFacts: { icon: IconName; label: string; value: string }[] = [
    { icon: "target", label: "Goal", value: formatShortUSD(campaign.goal) },
    { icon: "calendar", label: "Banquet", value: eventShort },
    { icon: "phone", label: "Give by", value: "Zelle" },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>
      <SiteHeader />

      <main id="main">
        {/* Hero */}
        <section id="top" className="overflow-hidden">
          <div className={`${container} grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr]`}>
            <div>
              <p className={eyebrow}>{church.name}</p>
              <p lang="ti" className="mt-2 font-ethiopic text-lg text-navy/70">
                {church.parishGeez}
              </p>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-balance sm:text-6xl lg:text-7xl">
                Building a <span className="text-gold-ink italic">House of Light</span>
              </h1>
              <p className={`${lead} max-w-xl`}>
                Help us raise <strong className="font-semibold text-navy">{formatUSD(campaign.goal)}</strong> to
                renovate our church on Sunbury Road: a place of prayer, fellowship and faith for generations to come.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#give"
                  className="rounded-full bg-navy px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                >
                  Donate now
                </a>
                <a
                  href="#banquet"
                  className="rounded-full bg-white px-7 py-3.5 font-semibold text-navy ring-1 ring-navy/15 transition hover:ring-navy/40"
                >
                  Banquet tickets
                </a>
              </div>
              <ul className="mt-10 grid grid-cols-3 gap-3">
                {heroFacts.map((c) => (
                  <li
                    key={c.label}
                    className="flex flex-col gap-2 rounded-2xl bg-white px-3 py-3 ring-1 ring-navy/10 sm:flex-row sm:items-center sm:gap-3 sm:px-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-ink">
                      <Icon name={c.icon} />
                    </span>
                    <span className="leading-tight">
                      <span className="block text-xs text-navy/60">{c.label}</span>
                      <span className="block font-semibold whitespace-nowrap">{c.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="relative pb-6">
              <div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-navy/10">
                <Image
                  src="/images/facade.webp"
                  alt="Rendering of the renovated church entrance, with the icon of St. Mary above the arched glass doors"
                  width={816}
                  height={378}
                  priority
                  sizes="(min-width: 1024px) 540px, 100vw"
                  className="h-auto w-full lg:aspect-[5/4] lg:object-cover"
                />
              </div>
              <figcaption className="absolute bottom-0 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-navy/10">
                <Image src="/debre-brhan-emblem.png" alt="" width={36} height={36} className="h-9 w-9" />
                <span className="text-sm leading-tight">
                  <span className="block font-semibold">Campaign launches</span>
                  <span className="text-navy/60">{fundraisingEvent.dateLabel}</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Vision */}
        <section id="vision" className="bg-white py-16 sm:py-24">
          <div className={container}>
            <SectionHeader
              kicker="The vision"
              title={
                <>
                  Debre Brhan: <span className="text-gold-ink italic">the Mount of Light</span>
                </>
              }
            >
              Our parish carries the name of light. This renovation renews the building we call home, so that everyone
              who walks through its doors can find peace, prayer and a family in faith.
            </SectionHeader>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {vision.map((v) => (
                <div key={v.title} className="rounded-3xl bg-cream p-6 ring-1 ring-navy/5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-gold-light">
                    <Icon name={v.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">{v.title}</h3>
                  <p className="mt-2 text-navy/70">{v.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {renderings.map((img) => (
                <figure key={img.src} className="overflow-hidden rounded-3xl bg-cream ring-1 ring-navy/10">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    sizes="(min-width: 768px) 540px, 100vw"
                    className="h-auto w-full"
                  />
                  <figcaption className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="font-semibold">{img.caption}</span>
                    <span className="text-navy/60">Architectural rendering</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Progress + impact */}
        <section id="progress" className="py-16 sm:py-24">
          <div className={container}>
            <SectionHeader kicker="Our progress" title={campaign.project}>
              {campaign.raised > 0
                ? "Every gift, large or small, moves the line forward."
                : `Our campaign begins at the fundraising banquet on ${fundraisingEvent.dateLabel}. Be among the first to give: every gift from that day on moves the line forward.`}
            </SectionHeader>
            <div className="mt-10">
              <ProgressMeter />
            </div>

            <h3 className="mt-16 font-display text-3xl font-semibold">What your gift builds</h3>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {impact.map((item) => (
                <li key={item.title} className="rounded-3xl bg-white p-6 ring-1 ring-navy/10">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold-ink">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <h4 className="mt-4 font-display text-xl font-semibold">{item.title}</h4>
                  <p className="mt-2 text-sm text-navy/70">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Banquet */}
        <section id="banquet" className="bg-navy-deep py-16 text-white sm:py-24">
          <div className={`${container} grid items-center gap-12 lg:grid-cols-2`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gold">Join us in person</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                {fundraisingEvent.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/75">
                Celebrate the launch of our campaign with an afternoon and evening of food, fellowship and live
                entertainment.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  `${fundraisingEvent.dateLabel}, ${fundraisingEvent.timeLabel}`,
                  `${fundraisingEvent.venue}, ${fundraisingEvent.address}`,
                  `${formatUSD(fundraisingEvent.price)} per person · Zelle or cash`,
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="text-white/90">{line}</span>
                  </li>
                ))}
              </ul>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
              >
                <Icon name="pin" />
                Get directions
              </a>
            </div>
            <EventCard />
          </div>
        </section>

        {/* Give */}
        <section id="give" className="bg-white py-16 sm:py-24">
          <div className={container}>
            <SectionHeader kicker="Give today" title="Help us finish the house of light">
              Give once or monthly. Every gift goes toward the renovation of {church.name}.
            </SectionHeader>

            <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
              <DonationForm />

              <div className="rounded-3xl bg-cream p-6 ring-1 ring-navy/10 sm:p-8">
                <h3 className="font-display text-3xl font-semibold">Ways to give</h3>
                <dl className="mt-6 divide-y divide-navy/10">
                  <div className="pb-5">
                    <dt className="font-semibold">Zelle</dt>
                    <dd className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-navy/10 select-all">
                        {giving.zelle}
                      </span>
                      <CopyButton
                        value={giving.zelle}
                        label={`Copy Zelle address ${giving.zelle}`}
                        className="rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                      />
                    </dd>
                    <dd className="mt-2 text-sm text-navy/70">Add “{giving.memo}” in the memo.</dd>
                  </div>
                  <div className="py-5">
                    <dt className="font-semibold">Cash</dt>
                    <dd className="mt-1 text-sm text-navy/70">In person at the church.</dd>
                  </div>
                  <div className="pt-5">
                    <dt className="font-semibold">Check by mail</dt>
                    <dd className="mt-1 text-sm text-navy/70">
                      Payable to {church.name}
                      <br />
                      {street}, {city}, {region} {postal}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h3 className="font-display text-3xl font-semibold">Give online or through work</h3>
                <p className="text-sm text-navy/60">
                  EIN <span className="font-semibold text-navy">{ein}</span>
                </p>
              </div>
              <ul className="mt-6 grid gap-5 md:grid-cols-3">
                {givingPlatforms.map((g) => (
                  <li key={g.name} className="flex flex-col rounded-3xl bg-cream p-6 ring-1 ring-navy/10">
                    <p className="font-display text-2xl font-semibold">{g.name}</p>
                    <p className="mt-1 text-sm text-navy/70">{g.description}</p>
                    <div className="mt-auto pt-5">
                      {g.url ? (
                        <a
                          href={g.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-navy/15 transition hover:ring-navy/40"
                        >
                          {g.cta}
                          <Icon name="external" className="h-4 w-4" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        <p className="text-sm text-navy/60">Search for our church by name or EIN.</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeader kicker="Questions" title="Frequently asked questions" />
            <div className="mt-8 divide-y divide-navy/10 rounded-3xl bg-white ring-1 ring-navy/10">
              {faqs.map((f) => (
                <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {f.q}
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand text-lg leading-none transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-navy/70">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy text-white/80">
        <div className={`${container} grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]`}>
          <div className="flex items-start gap-4">
            <Image src="/debre-brhan-emblem.png" alt="" width={56} height={56} className="h-14 w-14 shrink-0" />
            <div>
              <p className="font-display text-xl font-semibold text-white">{church.name}</p>
              <p lang="ti" className="mt-1 font-ethiopic text-white/70">
                {church.parishGeez}
              </p>
              <address className="mt-3 text-sm not-italic">
                {street}
                <br />
                {city}, {region} {postal}
              </address>
              <p className="mt-6 text-sm font-semibold text-white">Follow us</p>
              <SocialLinks className="mt-3" />
            </div>
          </div>
          <nav aria-label="Footer">
            <p className="text-sm font-semibold text-white">On this page</p>
            <ul className="mt-3 space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-sm font-semibold text-white">Give by Zelle</p>
            <p className="mt-3 text-sm">{giving.zelle}</p>
            <p className="mt-1 text-sm text-white/60">Memo: “{giving.memo}”</p>
            <p className="mt-6 text-sm font-semibold text-white">Nonprofit profile</p>
            <a
              href={candidUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm hover:text-white"
            >
              Candid · EIN {ein}
              <Icon name="external" className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
