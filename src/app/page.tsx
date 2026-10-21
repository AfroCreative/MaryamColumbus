import Image from "next/image";
import { DonationForm } from "@/components/DonationForm";
import { EventCard } from "@/components/EventCard";
import { FlyThroughProvider } from "@/components/FlyThroughProvider";
import { ProgressMeter } from "@/components/ProgressMeter";
import { SiteHeader } from "@/components/SiteHeader";
import { Waypoint } from "@/components/sections/Waypoint";
import { FlyThroughStage } from "@/components/stage/FlyThroughStage";
import { WaypointNav } from "@/components/WaypointNav";
import { campaign, church, formatUSD, fundraisingEvent } from "@/lib/campaign";

// Copy sits directly on the rendering, so it carries a soft shadow to stay
// legible over bright walls and sky.
const onImage = "[text-shadow:0_1px_16px_rgb(5_6_10/0.75)]";
const eyebrow = `text-xs font-medium uppercase tracking-[0.35em] text-gold ${onImage}`;
const heading = `font-display font-light leading-[1.02] text-balance ${onImage}`;
const body = `text-lg leading-relaxed text-parchment/90 text-pretty ${onImage}`;

const vision = [
  { title: "A renewed sanctuary", text: "A worthy home for the Divine Liturgy, the feasts and the prayers of our people." },
  { title: "A welcoming entrance", text: "An arched doorway crowned by the icon of our Holy Mother, open to all of Columbus." },
  { title: "Room to gather", text: "Space for fellowship, celebrations and the life of a growing parish family." },
];

const impact = [
  {
    n: "01",
    title: "Faith handed down",
    text: "Our children and grandchildren will learn the faith of their ancestors in a church built to last.",
  },
  {
    n: "02",
    title: "Fellowship that grows",
    text: "Baptisms, weddings, feasts and holidays: room for every milestone our community shares.",
  },
  {
    n: "03",
    title: "A light on Sunbury Road",
    text: "A landmark that welcomes newcomers, neighbors and visitors to the Eritrean Orthodox tradition.",
  },
  {
    n: "04",
    title: "A home that is ours",
    text: "Every gift brings us closer to a renovated church that belongs to the community, now and for generations.",
  },
];

export default function Home() {
  const launched = campaign.raised > 0;
  const pct = Math.round((campaign.raised / campaign.goal) * 100);
  const { street, city, region, postal } = church.address;

  return (
    <FlyThroughProvider>
      <FlyThroughStage />
      <SiteHeader />
      <WaypointNav />

      <main className="relative z-10">
        {/* 1 · Hero */}
        <Waypoint id="hero" className="items-end pb-28 sm:items-center sm:pb-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              <Image
                data-reveal
                src="/debre-brhan-emblem.png"
                alt={`${church.parish} emblem: the Virgin Mary holding the Christ child`}
                width={112}
                height={112}
                priority
                className="h-24 w-24 drop-shadow-[0_8px_30px_rgb(0_0_0/0.6)] sm:h-28 sm:w-28"
              />
              <p data-reveal className={`${eyebrow} mt-8`}>
                {church.name}
              </p>
              <p data-reveal lang="ti" className={`mt-3 font-ethiopic text-lg text-gold-soft ${onImage}`}>
                {church.parishGeez}
              </p>
              <h1 data-reveal className={`${heading} mt-6 text-6xl sm:text-8xl`}>
                Building a <em className="text-gold-soft">House of Light</em>
              </h1>
              <p data-reveal className={`${body} mt-6 max-w-xl`}>
                Help us raise <strong className="font-semibold text-parchment">{formatUSD(campaign.goal)}</strong> to
                renovate our church on Sunbury Road: a place of prayer, fellowship and faith for generations to come.
              </p>
              <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#give"
                  className="rounded-full bg-gold px-8 py-4 font-semibold text-ink shadow-[0_10px_40px_-10px_rgb(212_180_106/0.8)] transition hover:bg-gold-soft"
                >
                  Give today
                </a>
                <a
                  href="#vision"
                  className="rounded-full border border-parchment/30 px-8 py-4 text-parchment transition hover:border-parchment/70"
                >
                  See the vision
                </a>
                <span className={`text-sm text-parchment/75 ${onImage}`}>
                  {launched ? (
                    <>
                      <span className="text-gold-soft">{pct}%</span> of our goal raised
                    </>
                  ) : (
                    <>
                      Campaign launches <span className="text-gold-soft">{fundraisingEvent.dateLabel}</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div aria-hidden className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
            <span className="text-[0.6rem] uppercase tracking-[0.4em] text-parchment/50">Scroll</span>
            <span className="h-10 w-px animate-pulse bg-gradient-to-b from-parchment/60 to-transparent" />
          </div>
        </Waypoint>

        {/* 2 · Vision */}
        <Waypoint id="vision">
          <div className="mx-auto flex w-full max-w-7xl justify-end">
            <div className="max-w-xl">
              <p data-reveal className={eyebrow}>
                The Vision
              </p>
              <h2 data-reveal className={`${heading} mt-5 text-5xl sm:text-7xl`}>
                Debre Brhan: <em className="text-gold-soft">the Mount of Light</em>
              </h2>
              <p data-reveal className={`${body} mt-6`}>
                Our parish carries the name of light. This renovation renews the building we call home, so that every
                person who walks through its doors can find peace, prayer and a family in faith.
              </p>
              <ul className={`mt-10 space-y-6 border-l border-gold/40 pl-6 ${onImage}`}>
                {vision.map((v) => (
                  <li key={v.title} data-reveal>
                    <h3 className="font-display text-2xl">{v.title}</h3>
                    <p className="mt-1 text-parchment/70">{v.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Waypoint>

        {/* 3 · The Need */}
        <Waypoint id="need">
          <div className="mx-auto w-full max-w-4xl">
            <p data-reveal className={eyebrow}>
              The Need
            </p>
            <h2 data-reveal className={`${heading} mt-5 text-5xl sm:text-7xl`}>
              {campaign.project}
            </h2>
            <p data-reveal className={`${body} mt-6 max-w-2xl`}>
              {launched
                ? "Every gift, large or small, moves the line forward."
                : `Our campaign begins at the fundraising banquet on ${fundraisingEvent.dateLabel}. Be among the first to light the way: every gift from that day on moves the line forward.`}
            </p>
            <div data-reveal className="mt-12">
              <ProgressMeter />
            </div>
          </div>
        </Waypoint>

        {/* 4 · The Impact */}
        <Waypoint id="impact">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-2xl">
              <p data-reveal className={eyebrow}>
                The Impact
              </p>
              <h2 data-reveal className={`${heading} mt-5 text-5xl sm:text-7xl`}>
                What your gift <em className="text-gold-soft">builds</em>
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {impact.map((item) => (
                <article
                  key={item.n}
                  data-reveal
                  className="rounded-3xl border border-white/10 bg-ink/45 p-7 backdrop-blur-md transition hover:border-gold/40"
                >
                  <span className="font-display text-sm text-gold">{item.n}</span>
                  <h3 className="mt-6 font-display text-3xl leading-tight">{item.title}</h3>
                  <p className="mt-3 text-parchment/70">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </Waypoint>

        {/* 5 · Call to action */}
        <Waypoint id="give" className="flex-col justify-center">
          <div className="mx-auto grid w-full max-w-7xl items-start gap-12 lg:grid-cols-[1fr_minmax(0,28rem)]">
            <div>
              <p data-reveal className={eyebrow}>
                Give Today
              </p>
              <h2 data-reveal className={`${heading} mt-5 text-5xl sm:text-7xl`}>
                Help us finish <em className="text-gold-soft">the house of light</em>
              </h2>
              <p data-reveal className={`${body} mt-6 max-w-xl`}>
                Give once or monthly. Every gift goes toward the renovation of {church.name}.
              </p>
              <div data-reveal className="mt-10 max-w-xl">
                <EventCard />
              </div>
              <p data-reveal className="mt-8 max-w-xl text-sm text-parchment/60">
                Prefer to give by check? Make it payable to {church.name} and mail it to {street}, {city}, {region}{" "}
                {postal}.
              </p>
            </div>
            <div data-reveal>
              <DonationForm />
            </div>
          </div>

          <footer className="mx-auto mt-24 flex w-full max-w-7xl flex-col gap-2 border-t border-white/10 pt-8 text-sm text-parchment/50 sm:flex-row sm:justify-between">
            <p>
              {church.name} · {church.parish}
            </p>
            <address className="not-italic">
              {street}, {city}, {region} {postal}
            </address>
          </footer>
        </Waypoint>
      </main>
    </FlyThroughProvider>
  );
}
