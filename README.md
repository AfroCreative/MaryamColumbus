# Church Fundraising Fly-Through

A Next.js landing page with a scroll-scrubbed background. As you scroll, the
camera flies through the church while the campaign story plays over it.

## Stack
- Next.js 15 (App Router) with TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- GSAP 3 with ScrollTrigger, via `@gsap/react`'s `useGSAP`

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

## Assets
- Frame sequence: `public/flythrough/frames/`
- 3D model (.glb / .gltf): `public/flythrough/models/`

The exact naming conventions will be documented once the rendering approach
is chosen.
