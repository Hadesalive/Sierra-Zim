# SierraZim website — CMS plan

A plan to let non-developers (e.g. the MD / office staff) manage **all page content** —
text, images, **videos**, programmes, sectors, clients, case studies, gallery, FAQs and
contact details — without editing code.

> TL;DR recommendation: **don't hand-build a CMS.** Adopt a proven one and map our
> existing `src/lib/site.ts` content into it. Best fit for SierraZim is a **git-based CMS
> (Keystatic)** for the lowest cost and zero servers, or **Sanity** if you want instant
> publishing and the richest editor. A fully custom admin is possible but is the worst
> value for a site this size (see §3).

---

## 1. Goals & constraints

- **Editors are non-technical.** The UI must be plain-English, forgiving, with image/video
  upload and live preview. No Markdown/JSON/code required.
- **Everything is editable:** site/contact details, home & about & contact copy, the 7
  programmes, sectors, clients, case studies, gallery (images **and** videos), FAQs, stats,
  leadership.
- **Keep the site fast.** Today every page is static (SSG) — we must keep that (SSG/ISR),
  not turn it into a slow database-backed render.
- **Low cost / low maintenance.** Small business; ideally free or near-free, no server to
  babysit.
- **Sierra Leone context.** Editors may have intermittent/low bandwidth; large media should
  live on a CDN / video host, not be uploaded as huge files each time.
- **Safe.** Drafts + preview before publish; roles so only the right people publish.

## 2. Content inventory & proposed model

All content currently lives as typed objects in `src/lib/site.ts`. That's the migration
source. Proposed CMS shape:

**Singletons (edit-in-place, one of each):**
| Singleton | Maps to today | Fields |
|---|---|---|
| Site settings | `site`, `whatsappLink`, `mapsHref` | name, tagline, description, email, phones[], whatsapp, address, hours, leadership[] |
| Home page | hero/section copy in `Hero`, section components | hero eyebrow/headline/subhead, section headings, stats[] |
| About page | `about/page.tsx` copy, `valueProps`, locations | story blocks, value props[], locations[], leadership |
| Contact page | `contact/page.tsx` copy | heading, intro |
| SEO defaults | `layout.tsx` metadata | default title/description, default OG image |
| How-it-works / Certificate | `howItWorks`, `certificate` | steps[], certificate requirements[] |

**Collections (add / edit / remove / reorder many):**
| Collection | Maps to today | Key fields |
|---|---|---|
| Programmes | `services` + `serviceDetails` | title, slug, short, description, features[], image, audience, format, certification, icon |
| Sectors | `sectors` | name, slug, title, intro, programmes[ref], clients[ref], image, metaDescription |
| Clients | `clients` | name, sector, context |
| Case studies | `caseStudies` | client, sector, location, year, title, summary, overview, delivered[], outcomes[], services[ref], gallery[], realPhotos |
| Gallery items | `gallery` | **type: image \| video**, image OR {provider, videoId/file, poster}, alt, caption, width, height |
| FAQs | `faqs` | question, answer, order |

The **gallery already supports video** in code (image / self-hosted MP4 / YouTube / Vimeo),
so the CMS just needs an image-or-video field with a poster picker.

## 3. Approach options

| | **Keystatic** (git-based) | **Sanity** (hosted) | **Payload 3** (self-hosted, Next-native) | **Custom build** |
|---|---|---|---|---|
| Where content lives | Files in this repo (git) | Sanity cloud | Your DB (Postgres/Mongo) | Your DB |
| Infra needed | None (runs in the Next app) | None (their cloud) | DB + media store | DB + media store + auth + the whole admin |
| Editor UX | Good, simple | Excellent (best-in-class) | Very good | Whatever we build (months of work) |
| Publishing | Commit → Vercel rebuild (~1–2 min) | Instant (on-demand revalidate) | Instant (revalidate) | Instant |
| Media / video | Images in repo or cloud; **video via YouTube/Vimeo/Mux** | Sanity CDN images; video via Mux/embed | Vercel Blob / S3; video via embed/Mux | You build it |
| Roles / drafts | Basic (via GitHub) | Yes | Yes (granular) | You build it |
| Cost | **Free** | Free tier → paid as you grow | Free software; pay for DB + hosting | High build + ongoing maintenance |
| Maintenance | Minimal | Minimal | Moderate (you own the DB/upgrades) | High (security, backups, upgrades) |
| Best when | Infrequent edits, content lives with code, zero budget | Frequent edits, multiple editors, rich media, want instant publish | You want to fully own the stack + roles, no per-seat fees | You have a hard requirement nothing else meets |

**Recommendation**

1. **Keystatic (git-based) — recommended default.** Our content is already structured data
   in the repo and edits are infrequent (a training academy updates programmes / gallery /
   clients occasionally). Keystatic gives a friendly admin at `/keystatic`, commits changes
   to GitHub, and Vercel rebuilds automatically. **Free, no database, no server.** Videos go
   on YouTube/Vimeo (already supported) so the repo stays light.
2. **Sanity — upgrade path** if you want **instant publishing** (no rebuild wait), several
   editors, scheduled publishing, and a more polished editor. Small monthly cost as usage
   grows; content lives in Sanity's cloud (data-ownership trade-off).
3. **Payload 3** if you specifically want a **self-owned, role-based admin** living in your
   own database with no per-seat fees. More infra (a Postgres like Neon + a blob store) and
   you own upgrades/backups.
4. **Custom build** — only if a hard requirement rules the others out. For this site it's the
   worst value: weeks of build plus indefinite maintenance (auth, media, drafts, versioning,
   security) to re-create what the above give for free.

## 4. Architecture & data flow

**Git-based (Keystatic) — recommended:**
```
Editor → /keystatic admin (logs in with GitHub) → edits content
        → Keystatic commits MD/JSON/YAML to /content in the repo
        → Vercel detects the commit → rebuilds (SSG) → live in ~1–2 min
Pages read content at build via Keystatic's reader API (replacing src/lib/site.ts imports).
```

**Headless (Sanity / Payload) — if chosen:**
```
Editor → CMS Studio → Publish
        → webhook → /api/revalidate (on-demand ISR) → only changed pages refresh, instantly
Pages fetch via the CMS client at build + revalidate on demand (no full redeploy).
```

Either way the **public site stays static/fast**; only the *editing* mechanism differs.

## 5. Media & video

- **Images:** keep `next/image`. With Keystatic, store in the repo or a cloud bucket; with
  Sanity, use its image CDN (auto crop/format).
- **Videos:** prefer **YouTube/Vimeo** (free hosting/streaming; already wired into the
  gallery as a click-to-play facade) or **Mux** for branded self-hosted streaming. **Avoid
  committing large MP4s to git.** The CMS gallery field offers: upload image · or paste a
  YouTube/Vimeo link + pick a poster.

## 6. Editorial workflow

- **Draft → Preview → Publish.** Next.js Draft Mode renders unpublished content on a preview
  URL so editors see changes before they go live.
- **Roles:** Admin (can publish + manage settings) vs Editor (can draft). Git-based uses
  GitHub permissions; Sanity/Payload have built-in roles.

## 7. Migration plan (phased)

- **Phase 0 — Decide & set up (½–1 day):** pick the CMS; verify current version compatibility
  with Next 16; create the project/auth; add `/keystatic` (or Studio) route.
- **Phase 1 — Model + seed (1–2 days):** define collections/singletons (§2); write a one-time
  script to import `src/lib/site.ts` into the CMS so nothing is retyped.
- **Phase 2 — Wire pages (1–2 days):** replace `site.ts` imports with the CMS reader/fetch,
  keeping the existing TypeScript types so components barely change.
- **Phase 3 — Preview + publish (½–1 day):** Draft Mode preview; for headless, on-demand
  revalidation via webhook.
- **Phase 4 — Handover (½ day):** short editor guide + a walkthrough with the MD.

**Rough total: ~4–6 focused days** for Keystatic/Sanity. Payload a little more (DB/storage).
Custom build: **weeks**, plus ongoing maintenance.

## 8. Cost (indicative — verify at build time)

- **Keystatic:** software free; hosting already on Vercel; **$0** extra (videos on YouTube).
- **Sanity:** free tier covers a small site; paid plans kick in with heavy usage/seats.
- **Payload:** software free; pay for a small Postgres (e.g. Neon free/low tier) + blob store.
- **Custom:** highest — engineering time + DB + storage + ongoing upkeep.

## 9. Decisions we need from you

1. **Publish speed:** is a ~1–2 min rebuild after each edit fine (→ Keystatic, free), or do
   you need changes to appear **instantly** (→ Sanity / Payload)?
2. **How often** will content change, and **how many people** will edit?
3. **Data ownership:** content in your own repo/DB (Keystatic/Payload) vs a hosted cloud
   (Sanity)?
4. **Budget:** aim for **$0/month** (Keystatic) or is a small monthly fee acceptable for a
   nicer editor (Sanity)?
5. **Video:** OK to host videos on **YouTube/Vimeo** (recommended), or do you need
   self-hosted/branded streaming (Mux)?
6. **Multilingual** later (e.g. Krio/French)? Affects the model — good to know up front.

## 10. Recommended next step

Go with **Keystatic** unless you need instant publishing or multiple concurrent editors.
On approval: Phase 0–1 (set it up + migrate `site.ts` so the MD can immediately edit
programmes, gallery, clients, FAQs and contact details from a simple admin screen).
