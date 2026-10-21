# Church Fundraising Fly-Through

A Next.js landing page with a scroll-scrubbed background. As you scroll, the
camera flies through the church while the campaign story plays over it.

## Stack
- Next.js 15 (App Router) with TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- GSAP 3 with ScrollTrigger, via `@gsap/react`'s `useGSAP`

## Before launch: edit `src/lib/campaign.ts`
- `campaign.raised`: the real running total. The current value is a placeholder.
- `campaign.givingUrl`: the church's online giving page. The form sends donors
  there with `?amount=…&frequency=once|monthly`. Until it's set, the form
  explains how to give in person or by check.
- `fundraisingEvent.ticketUrl`: a ticket sales link (optional).
- Giving-tier names and notes, plus the Vision and Impact copy (in
  `src/app/page.tsx`), are drafts for the church to review.

## Run
```bash
npm install
npm run dev   # http://localhost:3000
```

## Architecture
```
src/
  app/
    layout.tsx            fonts, metadata, no-JS reveal fallback
    page.tsx              the five narrative waypoints
    globals.css           Tailwind theme (ink / parchment / gold, serif display)
  lib/
    gsap.ts               plugin registration + global GSAP/ScrollTrigger config
    campaign.ts           campaign copy, goal/raised numbers, waypoint anchors
  hooks/
    useScrollTimeline.ts  scrub:true master timeline + lerp-smoothed progress
    useReveal.ts          fade/upward reveal for [data-reveal] elements
  components/
    FlyThroughProvider.tsx  shares the scroll timeline through context
    stage/FlyThroughStage.tsx   fixed inset-0 z-0 background + vignette
    stage/PlaceholderRenderer.tsx  test renderer until real assets land
    sections/Waypoint.tsx   min-h-screen scroll section
```

### How scrubbing works
`useScrollTimeline` builds a one-second linear GSAP timeline attached to a
ScrollTrigger with `scrub: true`, running from the top of the narrative to the
bottom. On every `gsap.ticker` frame its raw progress is lerped into a
smoothed value that does not depend on frame rate. Renderers read
`progress.current` in their own loop, or call `subscribe()`, so scrolling
never re-renders React. Smoothing is turned off when the user prefers reduced
motion.

## Fly-through assets (image-sequence canvas)

The background is a numbered frame sequence drawn to a `<canvas>`
(`FrameSequenceRenderer`). Frames stream in coarse-to-fine, so the whole
flight can be scrubbed straight away and fills in as it loads. If
`public/flythrough/frames/manifest.json` is missing, a procedural
placeholder renders instead.

There are two ways to produce frames. Both need `ffmpeg`, and both write
`public/flythrough/frames/frame_0001.webp …` plus `manifest.json`.

### A. From drone / cinematic video
```bash
scripts/extract-frames.sh path/to/flight.mp4 [fps=24] [width=1920] [quality=72]
```
Aim for 150–400 frames (about 20–60 MB). If it's heavier, lower the fps or
the width.

### B. From still renderings or photos
1. Put the images in `assets/flythrough/`:
   - `exterior-wide.jpg`: the wide rendering across the parking lot
   - `facade.jpg`: the front facade with the arched entrance and icon
2. Tune the shots in `assets/flythrough/stills.json`. For each shot, `focus`
   is the 0–1 point the camera pushes toward, `zoom` is `[start, end]`, and
   `frames` is the shot's length.
3. Run `node scripts/stills-to-frames.mjs`.

The default flight pushes across the grounds toward the entrance,
cross-fades to the facade, pushes in through the doors, then pulls back to
reveal the whole building. Higher-resolution sources (2500 px wide or more)
keep the deep push-ins sharp. To extend the flight, add interior renderings
or construction-progress photos as extra shots.

Commit the generated `public/flythrough/frames/` so it deploys with the site.
