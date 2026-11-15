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
| Hero | Church name, goal, donate and banquet buttons, the facade rendering, live amount raised |
| Why (`#why`) | Drone photos of the church today, then crowded classrooms vs. what the project builds |
| The plan (`#plan`) | New classrooms (main focus), gathering hall, sanctuary expansion, renderings |
| Progress (`#progress`) | Goal / raised meter and "What your gift builds" cards |
| Banquet (`#banquet`) | Event details, directions link and the ticket card |
| Give (`#give`) | Donation form, Zelle / cash / check, and Candid / Benevity / Bonterra |
| FAQ (`#faq`) | Common questions |

## Updating the amount raised (admin)
Sign in at **`/admin/login`** to update the total. On `/admin` you can
**add a gift** to the total or **set the total**. The home page reads the
saved total on every visit, and pages already open re-check it every 30
seconds (`/api/progress`).

Server settings (see `.env.example`; locally, put them in `.env.local`):
- `ADMIN_PASSWORD` (required): the password for `/admin`. Until it's set the
  login page says admin isn't set up and nobody can sign in.
- `SESSION_SECRET` (optional): signs the 8-hour login cookie.
- Storage: on a regular Node server (`npm run build && npm start`) the total
  is saved to `data/progress.json` (`PROGRESS_FILE` to change it). On Vercel
  or another serverless host, add a free Upstash Redis database and set
  `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (Vercel KV's
  `KV_REST_API_URL` / `KV_REST_API_TOKEN` also work).

Before launch the progress card shows the goal and a countdown to the
banquet. Once a total is saved or the banquet date has passed, it shows the
live meter.

## Updating content
Everything editable lives in `src/lib/campaign.ts`:
- `campaign.raised`: the starting total, used only until one is saved at
  `/admin`.
- `giving.zelle` / `giving.memo`: the Zelle address for gifts and tickets,
  and the memo donors are asked to add.
- `giving.cardUrl`: the SwipeSimple card payment page, used by the donation
  form, "Ways to give", the banquet card and the footer. The amount isn't
  passed in the link: pressing Give tells donors which amount to enter, with
  Zelle, cash and check as alternatives.
- `fundraisingEvent`: banquet date, time, venue, price and payment methods.
- `givingTiers`, `faqs`, `navLinks`: gift amounts, FAQ entries and menu items.
- `socials`: Facebook, Instagram and LinkedIn links (footer).
- `givingPlatforms` / `ein`: Candid, Benevity and Bonterra cards in the Give
  section. Leave a `url` empty to show that platform as "search for us by
  name or EIN".

Images live in `public/`: `debre-brhan-emblem.png`,
`images/facade.webp` / `images/exterior-wide.webp` (the renderings), and
`images/church-today-aerial.webp` / `images/church-today-grounds.webp` (drone
photos of the current church, shown in the Why section). To use
higher-resolution renderings, replace those files and keep the names.
