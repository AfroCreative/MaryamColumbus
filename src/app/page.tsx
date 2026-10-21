import { FlyThroughProvider } from "@/components/FlyThroughProvider";
import { FlyThroughStage } from "@/components/stage/FlyThroughStage";
import { Waypoint } from "@/components/sections/Waypoint";
import { campaign } from "@/lib/campaign";

// Scaffold of the five narrative waypoints. The copy here is placeholder —
// the full Tailwind overlays (progress visualisation, giving tiers, form)
// replace these blocks in the next step.
export default function Home() {
  return (
    <FlyThroughProvider>
      <FlyThroughStage />

      <main className="relative z-10">
        <Waypoint id="hero">
          <div className="max-w-3xl">
            <p data-reveal className="text-xs uppercase tracking-[0.35em] text-gold">
              {campaign.churchName} · {campaign.city}
            </p>
            <h1 data-reveal className="mt-6 font-display text-6xl font-light leading-[0.95] sm:text-8xl">
              {campaign.campaignName}
            </h1>
          </div>
        </Waypoint>

        <Waypoint id="vision">
          <h2 data-reveal className="font-display text-5xl font-light sm:text-7xl">The Vision</h2>
        </Waypoint>

        <Waypoint id="need">
          <h2 data-reveal className="font-display text-5xl font-light sm:text-7xl">The Need</h2>
        </Waypoint>

        <Waypoint id="impact">
          <h2 data-reveal className="font-display text-5xl font-light sm:text-7xl">The Impact</h2>
        </Waypoint>

        <Waypoint id="give">
          <h2 data-reveal className="font-display text-5xl font-light sm:text-7xl">Give Today</h2>
        </Waypoint>
      </main>
    </FlyThroughProvider>
  );
}
