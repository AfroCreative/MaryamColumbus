# St. Mary Debre Brhan Renovation Campaign

Fundraising site for St. Mary Eritrean Orthodox Tewahdo Church (Debre Brhan),
1415 Sunbury Rd, Columbus, OH. It covers the $4 million renovation campaign
and the November 14, 2026 fundraising banquet. The campaign's main focus is
new classrooms and a community gathering hall, with the sanctuary expansion
secondary.

## Stack
- Next.js 15 (App Router) with TypeScript
- Tailwind CSS v4 (colour and font tokens in `src/app/globals.css`)

## Run
```bash
npm install
npm run dev   # http://localhost:3000
```

## Page layout
A single page with a sticky top menu (plus a mobile menu) that jumps to each
section:

| Section | What it shows |
| --- | --- |
| Hero | Church name, goal, donate and banquet buttons, the facade rendering |
| Why (`#why`) | The need: today's crowded classrooms vs. what the project builds |
| The plan (`#plan`) | New classrooms (main focus), gathering hall, sanctuary expansion, renderings |
| Progress (`#progress`) | Goal / raised meter and "What your gift builds" cards |
| Banquet (`#banquet`) | Event details, directions link and the ticket card |
| Give (`#give`) | Donation form, Zelle / cash / check, and Candid / Benevity / Bonterra |
| FAQ (`#faq`) | Common questions |

## Updating content
Everything editable lives in `src/lib/campaign.ts`:
- `campaign.raised`: the running total. While it's `0`, the progress card
  shows the goal and a countdown to the banquet. Enter the real figure and
  it switches to the live meter.
- `giving.zelle` / `giving.memo`: the Zelle address for gifts and tickets,
  and the memo donors are asked to add.
- `campaign.givingUrl`: optional online giving page. While it's empty,
  pressing Give shows Zelle, cash and check instructions for the chosen
  amount.
- `fundraisingEvent`: banquet date, time, venue, price and payment methods.
- `givingTiers`, `faqs`, `navLinks`: gift amounts, FAQ entries and menu items.
- `socials`: Facebook, Instagram and LinkedIn links (footer).
- `givingPlatforms` / `ein`: Candid, Benevity and Bonterra cards in the Give
  section. Leave a `url` empty to show that platform as "search for us by
  name or EIN".

Images live in `public/`: `debre-brhan-emblem.png` and
`images/facade.webp` / `images/exterior-wide.webp` (the renderings). To use
higher-resolution renderings, replace those files and keep the names.
