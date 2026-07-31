# CMS Wiring for v2 Redesign + Responsive Hardening — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every real piece of marketing copy visible on the v2 "safety-yard"
redesign is CMS-editable in Payload `/admin`, and the redesign holds up
across mobile/tablet/desktop viewports.

**Architecture:** No structural change. Payload globals/collections →
`src/lib/content.ts` typed getters → Server Component pages → section
components as props, with every text field falling back to the current
hardcoded copy when the CMS field is empty (existing convention throughout
this codebase — new fields follow it exactly).

**Tech Stack:** Next.js 16 (App Router, Turbopack), Payload 3.85 (Postgres
adapter, Neon), Tailwind v4, TypeScript.

## Global Constraints

- **This project's local dev environment reads/writes the SAME live Neon
  Postgres database as production.** There is no separate dev database
  (confirmed in `src/payload.config.ts` — one `DATABASE_URI`, no env
  branching).
- **NEVER run** `npm run dev` / `next dev` in this repo during this work.
  Payload's dev-mode schema "push" prompts interactively against the live
  DB and cannot be trusted non-interactively.
- **NEVER run** `scripts/seed.ts` — it clears live content collections
  (documented as destructive in `docs/deploy.md`).
- **Schema changes in this plan are purely additive** (new nullable
  fields on existing collections/globals; no renames, no drops, no type
  changes) — by design, because additive changes don't trigger
  Payload/Drizzle's interactive rename-vs-create prompt.
- **Every schema-changing task (5, 6) must, in order:** (1) add the
  field(s) to the collection/global TypeScript file; (2)
  `npm run generate:types` (safe — reads config, not the DB); (3)
  `npx payload migrate:create <descriptive-name>` (introspects the live DB
  schema and diffs against code — read-only against the DB, writes a local
  migration file); (4) **read the generated migration file** — if it
  contains anything other than `CREATE TABLE` / `ALTER TABLE ... ADD
  COLUMN` statements (any `DROP`, `RENAME`, `ALTER COLUMN ... TYPE`), STOP,
  do not apply it, report BLOCKED with the file contents; (5) if
  additive-only, apply with `npm run migrate`, then verify with
  `npm run build`.
- **No test framework exists in this repo** (Next.js starter default —
  not a gap introduced here). "Tests" for every task means: `npm run
  lint` clean and `npm run build` green (prerenders all pages against the
  live Neon content — a read-only build, safe to run anytime).
- **Every new/changed text field must fall back to the exact current
  hardcoded string when empty** — never let a page go blank or throw
  because a CMS field wasn't filled in. This matches the `||` fallback
  pattern used throughout `src/components/sections/*.tsx` today.
- **Preserve exact visual output when all new CMS fields are left empty.**
  A clean `npm run build` with zero CMS edits made must render pixel-
  identical HTML to before each task (verify by reading the rendered
  fallback strings match the removed hardcoded strings verbatim).
- Path note: the repo root has a space in it —
  `/Users/ahmadsmacbookpro/Documents/work-seriou-work /sierra Zim/sierrazim-website`.
  Always quote it in shell commands.
- Work happens directly on branch `redesign-v2-safety-yard` in the main
  checkout (git worktree creation was attempted and hung repeatedly in
  this environment — abandoned; no isolated worktree is available for
  this plan). Commit after each task.

---

### Task 1: Fix hardcoded-copy wiring bugs (no schema change)

**Files:**
- Modify: `src/app/(frontend)/services/page.tsx:44-64`
- Modify: `src/app/(frontend)/portfolio/page.tsx:47-62`
- Modify: `src/app/(frontend)/sectors/page.tsx:34-49`
- Modify: `src/app/(frontend)/gallery/page.tsx:31-46`
- Modify: `src/components/sections/field-record.tsx:77-79`
- Modify: `src/components/sections/programmes-accordion.tsx` (imports, the
  `countLine` area, and the `<h2>` at lines 35-39)

**Interfaces:**
- Consumes: `splitAccentHeading(s: string): [string, string]` from
  `@/lib/site` (already defined at `src/lib/site.ts:58-68`) — splits one
  string at the first comma, or before the last word if no comma.
- Produces: no new exports. Existing `IndexPage.title` (already fetched by
  every page, currently unused for rendering) is now actually rendered.

This task fixes four instances of the same bug: `getServicesPage()` /
`getPortfolioPage()` / `getSectorsPage()` / `getGalleryPage()` already
fetch a `title` field from Payload, but each page ignores it and renders a
hardcoded two-line JSX heading instead (the fetched `title` is only used
for the hidden OG-image `alt` text in `generateMetadata`). Fix each by
using `splitAccentHeading` on the CMS title, falling back to the exact
current hardcoded lines when the CMS field is empty.

- [ ] **Step 1: Fix `services/page.tsx`**

Add the import and replace the hardcoded title. Current (lines 1-10 keep
as-is, just add one import line after the `numberToWord` import):

```tsx
import { numberToWord, splitAccentHeading } from "@/lib/site";
```

Inside `export default async function ServicesPage()`, right after the
`Promise.all` destructure (after line 42), add:

```tsx
  const [heroLine1, heroLine2] = servicesHero.title
    ? splitAccentHeading(servicesHero.title)
    : [`${numberToWord(programmes.length)} programmes.`, "One standard."];
```

Replace the `title={...}` prop of `<PageHero>` (currently lines 48-54,
the `title={<>{...programmes.} <br/> <span...>One standard.</span></>}`
block) with:

```tsx
        title={
          <>
            {heroLine1}
            <br />
            <span className="text-safety-400">{heroLine2}</span>
          </>
        }
```

- [ ] **Step 2: Fix `portfolio/page.tsx`**

Add the import:

```tsx
import { COUNTRIES_SERVED, numberToWord, splitAccentHeading } from "@/lib/site";
```

(This replaces the existing `import { COUNTRIES_SERVED, numberToWord } from "@/lib/site";` at line 9.)

After the `Promise.all` destructure (after line 41, before `const featured = ...`), add:

```tsx
  const [heroLine1, heroLine2] = hero.title
    ? splitAccentHeading(hero.title)
    : ["The field", "record."];
```

Replace the `title={...}` prop of `<PageHero>` (currently lines 51-57,
`<>The field<br/><span className="stroke-white">record.</span></>`) with:

```tsx
        title={
          <>
            {heroLine1}
            <br />
            <span className="stroke-white">{heroLine2}</span>
          </>
        }
```

Note the accent class here is `stroke-white` (outline stroke), not a
color — preserve it exactly, do not copy the `text-safety-400` pattern
from other pages.

- [ ] **Step 3: Fix `sectors/page.tsx`**

Add the import:

```tsx
import { getSectors, getSite, getSectorsPage } from "@/lib/content";
import { splitAccentHeading } from "@/lib/site";
```

(the `splitAccentHeading` import is new; `getSectors`/`getSite`/
`getSectorsPage` already exist at line 7 — keep that line as-is and add
the new import line after it.)

After the `Promise.all` destructure (after line 33), add:

```tsx
  const [heroLine1, heroLine2] = hero.title
    ? splitAccentHeading(hero.title)
    : ["Sectors we", "train."];
```

Replace the `title={...}` prop of `<PageHero>` (currently lines 39-43,
`<>Sectors we<br/><span className="text-safety-400">train.</span></>`)
with:

```tsx
        title={
          <>
            {heroLine1}
            <br />
            <span className="text-safety-400">{heroLine2}</span>
          </>
        }
```

- [ ] **Step 4: Fix `gallery/page.tsx`**

Add the import:

```tsx
import { getGallery, getGalleryPage, getSite } from "@/lib/content";
import { splitAccentHeading } from "@/lib/site";
```

(`getGallery`/`getGalleryPage`/`getSite` already exist at line 6 — keep
that line as-is and add the new import line after it.)

After the `Promise.all` destructure (after line 29), add:

```tsx
  const [heroLine1, heroLine2] = hero.title
    ? splitAccentHeading(hero.title)
    : ["The yard,", "captured."];
```

Replace the `title={...}` prop of `<PageHero>` (currently lines 36-40,
`<>The yard,<br/><span className="text-safety-400">captured.</span></>`)
with:

```tsx
        title={
          <>
            {heroLine1}
            <br />
            <span className="text-safety-400">{heroLine2}</span>
          </>
        }
```

- [ ] **Step 5: Fix the field-record.tsx headline bug**

`src/components/sections/field-record.tsx:77-79` currently renders a
fully hardcoded headline even though `caseStudy.title` already exists on
the `CaseStudyItem` type (`src/lib/content.ts:352`) and is already used
correctly for the exact same purpose on
`src/app/(frontend)/portfolio/page.tsx:104-106`. Replace:

```tsx
          <h2 className="font-display text-fluid-6 font-extrabold uppercase leading-[0.9]">
            We took the academy across borders.
          </h2>
```

with:

```tsx
          <h2 className="font-display text-fluid-6 font-extrabold uppercase leading-[0.9]">
            {caseStudy.title || "We took the academy across borders."}
          </h2>
```

- [ ] **Step 6: Make the programmes-accordion second line CMS-driven**

`src/components/sections/programmes-accordion.tsx` currently renders
`"One standard."` unconditionally on the second line (line 38) even when
`heading` is set from the CMS — an editor filling in `programmesHeading`
in `/admin` cannot remove or change that second line. Fix using the same
`splitAccentHeading` pattern as Task 1's other fixes.

Add the import (new line after the existing `numberToWord` import at
line 4):

```tsx
import { numberToWord, splitAccentHeading } from "@/lib/site";
```

Replace line 25 (`const countLine = ...`) and the JSX at lines 35-39 as
follows. Current:

```tsx
  const countLine = `${numberToWord(programmes.length)} programmes.`;
```

becomes:

```tsx
  const countLine = `${numberToWord(programmes.length)} programmes.`;
  const [headingLine1, headingLine2] = heading
    ? splitAccentHeading(heading)
    : [countLine, "One standard."];
```

Current (lines 35-39):

```tsx
            <h2 className="font-display text-fluid-3 font-extrabold uppercase leading-[0.9] tracking-[0.005em]">
              {heading || countLine}
              <br />
              <span className="text-forest-700">One standard.</span>
            </h2>
```

becomes:

```tsx
            <h2 className="font-display text-fluid-3 font-extrabold uppercase leading-[0.9] tracking-[0.005em]">
              {headingLine1}
              <br />
              <span className="text-forest-700">{headingLine2}</span>
            </h2>
```

- [ ] **Step 7: Verify**

Run: `npm run lint` — expect clean.
Run: `npm run build` — expect all pages to prerender successfully (30+
routes). Confirm no TypeScript errors referencing `splitAccentHeading`,
`heroLine1`/`heroLine2`, or `headingLine1`/`headingLine2`.

- [ ] **Step 8: Commit**

```bash
git add src/app/'(frontend)'/services/page.tsx src/app/'(frontend)'/portfolio/page.tsx src/app/'(frontend)'/sectors/page.tsx src/app/'(frontend)'/gallery/page.tsx src/components/sections/field-record.tsx src/components/sections/programmes-accordion.tsx
git commit -m "Render CMS hero titles that were fetched but never used; make programmes-accordion second line CMS-driven"
```

---

### Task 2: Fix headline `clamp()` floor for narrow viewports

**Files:**
- Modify: `src/components/sections/page-hero.tsx:44,59,105`
- Modify: `src/components/sections/home-hero.tsx:52-54`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new — purely a CSS/inline-style value change plus one
  new Tailwind class on existing `<h1>` elements.

The stacked `PageHero` title (`clamp(56px, 8vw, 132px)`) and the split
`PageHero` title (`clamp(48px, 6.4vw, 104px)`) both hit their floor and
stop shrinking below roughly 700px viewport width — i.e. on every phone.
Because these are single CMS-editable words in `<span>`s with no wrap
fallback, a longer future CMS edit has no safety margin. Fix: increase
each clamp's `vw` coefficient so it keeps shrinking further into the
mobile range, lower the floor as a last-resort minimum, and add
`break-words` so a single long word wraps instead of overflowing.

- [ ] **Step 1: Fix the stacked `PageHero` title**

`src/components/sections/page-hero.tsx:42-49` — the `renderTitle`
function. Current:

```tsx
  const renderTitle = (fontSize: string) => (
    <h1
      className="rise font-display font-extrabold uppercase leading-[0.86] tracking-[0.005em]"
      style={{ animationDelay: "0.08s", fontSize }}
    >
      {title}
    </h1>
  );
```

becomes:

```tsx
  const renderTitle = (fontSize: string) => (
    <h1
      className="rise break-words font-display font-extrabold uppercase leading-[0.86] tracking-[0.005em]"
      style={{ animationDelay: "0.08s", fontSize }}
    >
      {title}
    </h1>
  );
```

- [ ] **Step 2: Lower the two clamp() call sites in page-hero.tsx**

Line 59 (split/About layout), current:

```tsx
            {renderTitle("clamp(48px, 6.4vw, 104px)")}
```

becomes:

```tsx
            {renderTitle("clamp(36px, 9vw, 104px)")}
```

Line 105 (stacked layout — Services/Portfolio/Sectors/Gallery/Contact),
current:

```tsx
        {renderTitle("clamp(56px, 8vw, 132px)")}
```

becomes:

```tsx
        {renderTitle("clamp(40px, 12vw, 132px)")}
```

- [ ] **Step 3: Fix `home-hero.tsx`**

`src/components/sections/home-hero.tsx:52-54`, current:

```tsx
          <h1
            className="rise font-display font-extrabold uppercase leading-[0.88] tracking-[0.005em]"
            style={{ animationDelay: "0.08s", fontSize: "clamp(56px, 11vw, 148px)" }}
          >
```

becomes:

```tsx
          <h1
            className="rise break-words font-display font-extrabold uppercase leading-[0.88] tracking-[0.005em]"
            style={{ animationDelay: "0.08s", fontSize: "clamp(40px, 13vw, 148px)" }}
          >
```

- [ ] **Step 4: Verify**

Run: `npm run lint` — expect clean.
Run: `npm run build` — expect green, no visual-affecting TypeScript
errors. Since there's no browser automation in this flow, note in the
commit message the specific check a human should do later: open `/about`,
`/services`, `/`, and `/contact` at a 375px-wide viewport and confirm the
headline text doesn't visually overflow its container or the viewport
edge.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/page-hero.tsx src/components/sections/home-hero.tsx
git commit -m "Responsive: lower headline clamp() floor for narrow viewports, add break-words safety"
```

---

### Task 3: Scale fixed vertical section padding for mobile

**Files:**
- Modify: `src/components/sections/the-standard.tsx:22`
- Modify: `src/components/sections/programmes-accordion.tsx:29`
- Modify: `src/components/sections/home-quote.tsx:19`
- Modify: `src/components/sections/proof-rail.tsx:32`
- Modify: `src/components/sections/cta-band.tsx:41`
- Modify: `src/app/(frontend)/about/page.tsx:86,140,185`
- Modify: `src/app/(frontend)/portfolio/page.tsx:134,190`
- Modify: `src/app/(frontend)/sectors/page.tsx:53`

**Interfaces:** None — Tailwind class changes only, no prop/type changes.

Every one of these sections currently pays a flat 120px (or 112px via
`py-28`) of top+bottom padding at every viewport width, including 375px
phones, where that's roughly 30% of the visible viewport height spent on
whitespace. Scale it down on mobile, restoring the current value only at
`lg:`.

- [ ] **Step 1: Fix the four `py-[120px]` / `pt-[120px]` sections**

`src/components/sections/the-standard.tsx:22`, current:

```tsx
      <div className="mx-auto w-full max-w-[90rem] px-6 py-[120px] sm:px-14">
```

becomes:

```tsx
      <div className="mx-auto w-full max-w-[90rem] px-6 py-16 sm:px-14 sm:py-20 lg:py-[120px]">
```

`src/components/sections/programmes-accordion.tsx:29`, current:

```tsx
      <div className="mx-auto w-full max-w-[90rem] px-6 py-[120px] sm:px-14">
```

becomes:

```tsx
      <div className="mx-auto w-full max-w-[90rem] px-6 py-16 sm:px-14 sm:py-20 lg:py-[120px]">
```

`src/components/sections/home-quote.tsx:19`, current:

```tsx
      <div className="mx-auto grid w-full max-w-[90rem] grid-cols-[auto_1fr] gap-8 px-6 py-[120px] sm:gap-12 sm:px-14">
```

becomes:

```tsx
      <div className="mx-auto grid w-full max-w-[90rem] grid-cols-[auto_1fr] gap-8 px-6 py-16 sm:gap-12 sm:px-14 sm:py-20 lg:py-[120px]">
```

`src/components/sections/proof-rail.tsx:32` (top-only padding — keep
`pb-14` as-is, only scale the top), current:

```tsx
      <div className="mx-auto w-full max-w-[90rem] px-6 pb-14 pt-[120px] sm:px-14">
```

becomes:

```tsx
      <div className="mx-auto w-full max-w-[90rem] px-6 pb-14 pt-16 sm:px-14 sm:pt-20 lg:pt-[120px]">
```

- [ ] **Step 2: Fix the `py-28` sections**

`src/components/sections/cta-band.tsx:41`, current:

```tsx
      <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-center justify-between gap-10 px-6 py-28 sm:px-14">
```

becomes:

```tsx
      <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-center justify-between gap-10 px-6 py-14 sm:px-14 sm:py-20 lg:py-28">
```

`src/app/(frontend)/about/page.tsx` — three occurrences of the `SHELL`
constant combined with `py-28`, all following the same pattern
`className={`${SHELL} py-28`}`. Lines 86, 140, 185. Replace all three
occurrences of:

```tsx
        <div className={`${SHELL} py-28`}>
```

with:

```tsx
        <div className={`${SHELL} py-14 sm:py-20 lg:py-28`}>
```

(All three are structurally identical lines — verify with a search for
`` `${SHELL} py-28` `` in the file; there are exactly 3 matches, all
should be replaced identically.)

`src/app/(frontend)/portfolio/page.tsx` — two occurrences at lines 134
and 190, same pattern. Replace both instances of:

```tsx
        <div className={`${SHELL} py-28`}>
```

with:

```tsx
        <div className={`${SHELL} py-14 sm:py-20 lg:py-28`}>
```

`src/app/(frontend)/sectors/page.tsx:53`, current:

```tsx
        <div className={`${SHELL} py-28`}>
```

becomes:

```tsx
        <div className={`${SHELL} py-14 sm:py-20 lg:py-28`}>
```

- [ ] **Step 3: Verify**

Run: `npm run lint` — expect clean.
Run: `npm run build` — expect green.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/the-standard.tsx src/components/sections/programmes-accordion.tsx src/components/sections/home-quote.tsx src/components/sections/proof-rail.tsx src/components/sections/cta-band.tsx src/app/'(frontend)'/about/page.tsx src/app/'(frontend)'/portfolio/page.tsx src/app/'(frontend)'/sectors/page.tsx
git commit -m "Responsive: scale fixed 120px/112px section padding down for mobile"
```

---

### Task 4: Defensive responsive hardening

**Files:**
- Modify: `src/components/sections/proof-rail.tsx:85`
- Modify: `src/components/sections/field-record.tsx:82,107`
- Modify: `src/app/(frontend)/portfolio/page.tsx:111,119`
- Modify: `src/app/(frontend)/services/page.tsx:106`

**Interfaces:** None — Tailwind class changes only.

Three independent defensive fixes for content-dependent risks that don't
break today's real content but have no safety margin for future edits.

- [ ] **Step 1: Constrain the ProofRail stat plate**

`src/components/sections/proof-rail.tsx:85`, current:

```tsx
                <p className="font-display text-[104px] font-extrabold leading-[0.85] text-safety-400">
```

becomes:

```tsx
                <p className="break-all font-display text-[clamp(48px,9vw,104px)] font-extrabold leading-[0.85] text-safety-400">
```

(This card has a fixed width — `w-[260px]` mobile / `sm:w-[300px]` — so
the stat *value* needs to shrink and hard-wrap rather than overflow if a
future value is longer than today's `"7"`, `"3"`, `"8+"`, `"100%"`.)

- [ ] **Step 2: Let the field-record route line wrap**

`src/components/sections/field-record.tsx:82`, current:

```tsx
          <div className="mt-9 flex items-center gap-4 font-mono text-[12px] uppercase tracking-[0.2em] text-white/85">
```

becomes:

```tsx
          <div className="mt-9 flex flex-wrap items-center gap-4 gap-y-2 font-mono text-[12px] uppercase tracking-[0.2em] text-white/85">
```

- [ ] **Step 3: Widen the docket label column**

Three files use the same fixed `110px` mobile column width for docket
label/value rows. Widen to `120px` in each (the `sm:` breakpoint value —
`140px`/`150px` — is unaffected, leave it as-is).

`src/components/sections/field-record.tsx:107`, current:

```tsx
                className="grid grid-cols-[110px_1fr] gap-6 border-b border-white/15 py-3.5 sm:grid-cols-[150px_1fr]"
```

becomes:

```tsx
                className="grid grid-cols-[120px_1fr] gap-6 border-b border-white/15 py-3.5 sm:grid-cols-[150px_1fr]"
```

`src/app/(frontend)/portfolio/page.tsx:111` and `:119` — both docket rows
(`Delivered` and `Outcome`) use the identical class string. Replace both
occurrences of:

```tsx
              <div className="grid grid-cols-[110px_1fr] gap-6 border-b border-white/15 py-3.5 sm:grid-cols-[150px_1fr]">
```

with:

```tsx
              <div className="grid grid-cols-[120px_1fr] gap-6 border-b border-white/15 py-3.5 sm:grid-cols-[150px_1fr]">
```

`src/app/(frontend)/services/page.tsx:106`, current:

```tsx
                        className="grid grid-cols-[110px_1fr] gap-5 border-b border-line py-3 sm:grid-cols-[140px_1fr] sm:gap-6"
```

becomes:

```tsx
                        className="grid grid-cols-[120px_1fr] gap-5 border-b border-line py-3 sm:grid-cols-[140px_1fr] sm:gap-6"
```

- [ ] **Step 4: Verify**

Run: `npm run lint` — expect clean.
Run: `npm run build` — expect green.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/proof-rail.tsx src/components/sections/field-record.tsx src/app/'(frontend)'/portfolio/page.tsx src/app/'(frontend)'/services/page.tsx
git commit -m "Responsive: defensive hardening for stat plate width, route-line wrap, docket column width"
```

---

### Task 5: Add the CTA band CMS schema and wire all 6 pages

**Files:**
- Modify: `src/fields/shared.ts`
- Modify: `src/globals/Home.ts`
- Modify: `src/globals/AboutPage.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/app/(frontend)/page.tsx:81-89` (Home)
- Modify: `src/app/(frontend)/services/page.tsx:138-145`
- Modify: `src/app/(frontend)/portfolio/page.tsx:235-240`
- Modify: `src/app/(frontend)/gallery/page.tsx:53-58`
- Modify: `src/app/(frontend)/sectors/page.tsx:87`
- Modify: `src/app/(frontend)/about/page.tsx:239`

**Interfaces:**
- Consumes: the existing `CtaBand` component signature (unchanged) at
  `src/components/sections/cta-band.tsx:14-30` —
  `{ site, titleTop?, titleBottom?, intro?, primaryLabel?, primaryHref?, secondary? }`.
- Produces: `CtaBandContent` type in `src/lib/content.ts` —
  `{ titleTop: string; titleBottom: string; intro: string; primaryLabel: string; secondary: "phone" | "whatsapp" | "none" | "" }`,
  a `cta: CtaBandContent` field added to `HomeContent`, `IndexPage`, and
  the About page getter's return type. Later tasks/pages that read these
  getters must include `cta` in any destructuring they add.

This is the highest-value fix: `CtaBand` is used on all 6 non-Contact
pages, each with different hardcoded copy, and there is currently no CMS
field for any of it anywhere.

- [ ] **Step 1: Add the reusable field group to `src/fields/shared.ts`**

Add this new export (place it after `heroImageField`, before
`indexPageFields`):

```ts
/** The closing CTA band shown near the bottom of most pages. Every field
 *  falls back to that page's hardcoded copy when left empty. */
export const ctaBandFields = (): Field => ({
  name: "cta",
  type: "group",
  label: "Closing CTA Band",
  fields: [
    { name: "titleTop", type: "text", label: "Headline — line 1" },
    { name: "titleBottom", type: "text", label: "Headline — line 2" },
    { name: "intro", type: "textarea" },
    { name: "primaryLabel", type: "text", label: "Primary button label" },
    {
      name: "secondary",
      type: "select",
      label: "Secondary action",
      defaultValue: "phone",
      options: [
        { label: "Phone", value: "phone" },
        { label: "WhatsApp", value: "whatsapp" },
        { label: "None", value: "none" },
      ],
    },
  ],
});
```

Then update `indexPageFields()` to add a third tab. Current (lines
76-97):

```ts
export const indexPageFields = (): Field[] => [
  {
    type: "tabs",
    tabs: [
      {
        label: "Hero",
        fields: [
          { name: "eyebrow", type: "text" },
          { name: "title", type: "text" },
          { name: "intro", type: "textarea" },
          heroImageField(),
        ],
      },
      {
        label: "SEO",
        fields: [
          { name: "metaDescription", type: "textarea", label: "Meta description" },
        ],
      },
    ],
  },
];
```

becomes:

```ts
export const indexPageFields = (): Field[] => [
  {
    type: "tabs",
    tabs: [
      {
        label: "Hero",
        fields: [
          { name: "eyebrow", type: "text" },
          { name: "title", type: "text" },
          { name: "intro", type: "textarea" },
          heroImageField(),
        ],
      },
      {
        label: "Closing CTA",
        fields: [ctaBandFields()],
      },
      {
        label: "SEO",
        fields: [
          { name: "metaDescription", type: "textarea", label: "Meta description" },
        ],
      },
    ],
  },
];
```

This single change adds the `cta` group to `ServicesPage`, `PortfolioPage`,
`GalleryPage`, and `SectorsPage` globals — all four already build their
`fields` from `indexPageFields()` and need no individual edits for this
task.

- [ ] **Step 2: Add the CTA tab to `src/globals/Home.ts`**

Add the import at the top: change

```ts
import type { GlobalConfig } from "payload";
```

to

```ts
import type { GlobalConfig } from "payload";

import { ctaBandFields } from "../fields/shared";
```

Add a fourth tab after `"Statement & stats"` (after line 97's closing
`},` and before the `],` that closes the `tabs` array at line 98):

```ts
        {
          label: "Closing CTA",
          fields: [ctaBandFields()],
        },
```

- [ ] **Step 3: Add the CTA tab to `src/globals/AboutPage.ts`**

Add the import — current line 3:

```ts
import { heroImageField } from "../fields/shared";
```

becomes:

```ts
import { ctaBandFields, heroImageField } from "../fields/shared";
```

Add a fifth tab after `"Leadership & locations"` (after line 56's closing
`},` and before the `"SEO"` tab that currently starts at line 57):

```ts
        {
          label: "Closing CTA",
          fields: [ctaBandFields()],
        },
```

- [ ] **Step 4: Add the `CtaBandContent` type and getter wiring in `src/lib/content.ts`**

Add this type and helper near the top, after the `asDoc` helper (after
line 32):

```ts
export type CtaBandContent = {
  titleTop: string;
  titleBottom: string;
  intro: string;
  primaryLabel: string;
  secondary: "phone" | "whatsapp" | "none" | "";
};

const ctaSecondary = (v: unknown): CtaBandContent["secondary"] =>
  v === "phone" || v === "whatsapp" || v === "none" ? v : "";

const ctaOf = (v: unknown): CtaBandContent => {
  const c = asDoc(v);
  return {
    titleTop: str(c?.titleTop),
    titleBottom: str(c?.titleBottom),
    intro: str(c?.intro),
    primaryLabel: str(c?.primaryLabel),
    secondary: ctaSecondary(c?.secondary),
  };
};
```

In `getHome()`, add `cta: ctaOf(h?.cta),` as the last line of the returned
object (just before the closing `};` at line 173).

In `getIndexPage()`, add `cta: ctaOf(g?.cta),` as the last line of the
returned object (just before the closing `};` at line 195), and add
`cta: CtaBandContent;` as the last line of the `IndexPage` type (just
before the closing `};` at line 184).

In `getAboutPage()`, add `cta: ctaOf(a?.cta),` as the last line of the
returned object (just before the closing `};` at line 228).

- [ ] **Step 5: Wire the Home page call site**

`src/app/(frontend)/page.tsx:86-89`, current:

```tsx
      <CtaBand
        site={site}
        intro="Tell us the programme, how many people and where — we reply within one business day."
      />
```

becomes:

```tsx
      <CtaBand
        site={site}
        titleTop={home.cta.titleTop || "Get your fleet"}
        titleBottom={home.cta.titleBottom || "certified."}
        intro={
          home.cta.intro ||
          "Tell us the programme, how many people and where — we reply within one business day."
        }
        primaryLabel={home.cta.primaryLabel || "Book a programme"}
        secondary={home.cta.secondary || "phone"}
      />
```

- [ ] **Step 6: Wire the Services page call site**

`src/app/(frontend)/services/page.tsx:138-145`, current:

```tsx
      <CtaBand
        site={site}
        titleTop="Not sure which"
        titleBottom="programme?"
        intro="Tell us your fleet and we'll build the training plan."
        primaryLabel="Talk to us"
        secondary="whatsapp"
      />
```

becomes:

```tsx
      <CtaBand
        site={site}
        titleTop={servicesHero.cta.titleTop || "Not sure which"}
        titleBottom={servicesHero.cta.titleBottom || "programme?"}
        intro={
          servicesHero.cta.intro ||
          "Tell us your fleet and we'll build the training plan."
        }
        primaryLabel={servicesHero.cta.primaryLabel || "Talk to us"}
        secondary={servicesHero.cta.secondary || "whatsapp"}
      />
```

- [ ] **Step 7: Wire the Portfolio page call site**

`src/app/(frontend)/portfolio/page.tsx:235-240`, current:

```tsx
      <CtaBand
        site={site}
        titleTop="Your fleet could be"
        titleBottom="the next record."
        secondary="none"
      />
```

becomes:

```tsx
      <CtaBand
        site={site}
        titleTop={hero.cta.titleTop || "Your fleet could be"}
        titleBottom={hero.cta.titleBottom || "the next record."}
        intro={hero.cta.intro || undefined}
        primaryLabel={hero.cta.primaryLabel || undefined}
        secondary={hero.cta.secondary || "none"}
      />
```

(`hero` here is the `getPortfolioPage()` result already destructured at
the top of the component — reuse it, do not introduce a new variable
name.)

- [ ] **Step 8: Wire the Gallery page call site**

`src/app/(frontend)/gallery/page.tsx:53-58`, current:

```tsx
      <CtaBand
        site={site}
        titleTop="Put your team"
        titleBottom="in the picture."
        secondary="none"
      />
```

becomes:

```tsx
      <CtaBand
        site={site}
        titleTop={hero.cta.titleTop || "Put your team"}
        titleBottom={hero.cta.titleBottom || "in the picture."}
        intro={hero.cta.intro || undefined}
        primaryLabel={hero.cta.primaryLabel || undefined}
        secondary={hero.cta.secondary || "none"}
      />
```

(`hero` here is the `getGalleryPage()` result already destructured at the
top of the component.)

- [ ] **Step 9: Wire the Sectors page call site**

`src/app/(frontend)/sectors/page.tsx:87`, current:

```tsx
      <CtaBand site={site} />
```

becomes:

```tsx
      <CtaBand
        site={site}
        titleTop={hero.cta.titleTop || "Get your fleet"}
        titleBottom={hero.cta.titleBottom || "certified."}
        intro={hero.cta.intro || undefined}
        primaryLabel={hero.cta.primaryLabel || "Book a programme"}
        secondary={hero.cta.secondary || "phone"}
      />
```

(`hero` here is the `getSectorsPage()` result already destructured at the
top of the component.)

- [ ] **Step 10: Wire the About page call site**

`src/app/(frontend)/about/page.tsx:239`, current:

```tsx
      <CtaBand site={site} />
```

becomes:

```tsx
      <CtaBand
        site={site}
        titleTop={about.cta.titleTop || "Get your fleet"}
        titleBottom={about.cta.titleBottom || "certified."}
        intro={about.cta.intro || undefined}
        primaryLabel={about.cta.primaryLabel || "Book a programme"}
        secondary={about.cta.secondary || "phone"}
      />
```

(`about` here is the `getAboutPage()` result already destructured at the
top of the component.)

- [ ] **Step 11: Generate types**

Run: `npm run generate:types`. Expect it to complete without error and
update `src/payload-types.ts` with the new `cta` group on `Home`,
`ServicesPage`, `PortfolioPage`, `GalleryPage`, `SectorsPage`, and
`AboutPage`.

- [ ] **Step 12: Generate and inspect the migration**

Run: `npx payload migrate:create add-cta-band-fields`.

Read the generated file under `src/migrations/`. Confirm it contains ONLY
`ALTER TABLE ... ADD COLUMN` statements (expect new nullable text/varchar
columns per affected table, prefixed `cta_` per Payload's group-field
column naming). If it contains anything else (`DROP`, `RENAME`, `ALTER
COLUMN ... TYPE`), STOP — do not proceed to Step 13, report BLOCKED with
the full migration file contents.

- [ ] **Step 13: Apply the migration and verify**

Run: `npm run migrate`.
Run: `npm run lint` — expect clean.
Run: `npm run build` — expect green, all pages prerendering with the
fallback copy identical to what was hardcoded before (since no CMS `cta`
fields have been filled in yet, every page must render exactly as it did
before this task).

- [ ] **Step 14: Commit**

```bash
git add src/fields/shared.ts src/globals/Home.ts src/globals/AboutPage.ts src/lib/content.ts src/app/'(frontend)'/page.tsx src/app/'(frontend)'/services/page.tsx src/app/'(frontend)'/portfolio/page.tsx src/app/'(frontend)'/gallery/page.tsx src/app/'(frontend)'/sectors/page.tsx src/app/'(frontend)'/about/page.tsx src/payload-types.ts src/migrations/
git commit -m "Add CMS-editable CTA band fields; wire all 6 page call sites"
```

---

### Task 6: Add remaining small CMS fields

**Files:**
- Modify: `src/globals/Home.ts`
- Modify: `src/globals/ContactPage.ts`
- Modify: `src/globals/ServicesPage.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/components/sections/proof-rail.tsx`
- Modify: `src/app/(frontend)/page.tsx` (the `<ProofRail>` call site)
- Modify: `src/app/(frontend)/contact/page.tsx:72-74`
- Modify: `src/app/(frontend)/services/page.tsx:59-63`

**Interfaces:**
- Consumes: nothing new from other tasks.
- Produces: `ProofRail` gains two new optional props `heading?: string`
  and `intro?: string`. `getContactPage()` gains `whatsappNote: string`.
  `getServicesPage()` becomes a standalone function (no longer a thin
  wrapper around `getIndexPage`) returning `IndexPage & { heroSpecs: { accent: string; rest: string }[] }`
  — name this returned type `ServicesPageContent` and export it, since a
  later maintainer reading `services/page.tsx` needs the exported name to
  understand the shape.

- [ ] **Step 1: Add ProofRail heading/intro fields to `src/globals/Home.ts`**

In the `"Sections"` tab, add these two fields immediately after
`certPathSteps` (after line 56's closing `},`, before the `whyUsEyebrow`
field at line 57):

```ts
            { name: "proofRailHeading", type: "text", label: "Proof rail — heading" },
            { name: "proofRailIntro", type: "textarea", label: "Proof rail — intro" },
```

- [ ] **Step 2: Wire `getHome()` in `src/lib/content.ts`**

Add these two lines to the object returned by `getHome()`, immediately
after the `certPathSteps` entry (after line 154's closing `})),` and
before the `whyUsEyebrow` line at 155):

```ts
    proofRailHeading: str(h?.proofRailHeading),
    proofRailIntro: str(h?.proofRailIntro),
```

- [ ] **Step 3: Wire the ProofRail component**

`src/components/sections/proof-rail.tsx` — add two new optional props
and use them for the heading/intro block. Current function signature
(lines 13-19):

```tsx
export function ProofRail({
  photos,
  stats,
}: {
  photos: Photo[];
  stats: HomeContent["stats"];
}) {
```

becomes:

```tsx
export function ProofRail({
  photos,
  stats,
  heading,
  intro,
}: {
  photos: Photo[];
  stats: HomeContent["stats"];
  heading?: string;
  intro?: string;
}) {
```

Current heading/intro block (lines 34-45):

```tsx
          <h2 className="font-display text-fluid-3 font-extrabold uppercase leading-[0.88]">
            Real ground.
            <br />
            Real machines.
            <br />
            <span className="stroke-green">Real results.</span>
          </h2>
          <div className="max-w-[360px] pb-2">
            <p className="text-base leading-[1.6] text-ink-soft">
              No mock-ups, no stock photos — the yard, the machines and the people
              we actually train.
            </p>
```

becomes:

```tsx
          <h2 className="font-display text-fluid-3 font-extrabold uppercase leading-[0.88]">
            {heading ? (
              <span className="stroke-green">{heading}</span>
            ) : (
              <>
                Real ground.
                <br />
                Real machines.
                <br />
                <span className="stroke-green">Real results.</span>
              </>
            )}
          </h2>
          <div className="max-w-[360px] pb-2">
            <p className="text-base leading-[1.6] text-ink-soft">
              {intro ||
                "No mock-ups, no stock photos — the yard, the machines and the people we actually train."}
            </p>
```

- [ ] **Step 4: Pass the new props at the Home page call site**

`src/app/(frontend)/page.tsx` — find the `<ProofRail photos={photos}
stats={home.stats} />` line and add the two new props:

```tsx
      <ProofRail
        photos={photos}
        stats={home.stats}
        heading={home.proofRailHeading}
        intro={home.proofRailIntro}
      />
```

- [ ] **Step 5: Add the WhatsApp note field to `src/globals/ContactPage.ts`**

In the `"Details"` tab, add a new field after `detailsHeading` (after
line 27's `{ name: "detailsHeading", type: "text" },`, before the
`fields` array's closing `],` at line 28):

```ts
            { name: "whatsappNote", type: "textarea", label: "WhatsApp note (under the headline)" },
```

- [ ] **Step 6: Wire `getContactPage()` in `src/lib/content.ts`**

Add this line to the object returned by `getContactPage()`, immediately
after `detailsHeading` (after line 242's `detailsHeading: str(c?.detailsHeading),`
and before the closing `};` at line 243):

```ts
    whatsappNote: str(c?.whatsappNote),
```

- [ ] **Step 7: Use the field in `contact/page.tsx`**

`src/app/(frontend)/contact/page.tsx:72-74`, current:

```tsx
            <p className="mt-5 text-[16.5px] leading-[1.6] text-ink-soft">
              WhatsApp is fastest — most of our clients book that way.
            </p>
```

becomes:

```tsx
            <p className="mt-5 text-[16.5px] leading-[1.6] text-ink-soft">
              {contact.whatsappNote ||
                "WhatsApp is fastest — most of our clients book that way."}
            </p>
```

- [ ] **Step 8: Add the hero specs array field to `src/globals/ServicesPage.ts`**

Current (the whole file):

```ts
import type { GlobalConfig } from "payload";

import { indexPageFields } from "../fields/shared";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  label: "Services Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: indexPageFields(),
};
```

becomes:

```ts
import type { GlobalConfig } from "payload";

import { indexPageFields } from "../fields/shared";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  label: "Services Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: [
    ...indexPageFields(),
    {
      name: "heroSpecs",
      type: "array",
      label: "Hero specs row (Theory / Practical / Certified)",
      maxRows: 3,
      fields: [
        { name: "accent", type: "text", label: "Word (accent)" },
        { name: "rest", type: "text", label: "Rest of line" },
      ],
    },
  ],
};
```

- [ ] **Step 9: Make `getServicesPage()` standalone in `src/lib/content.ts`**

Current (line 198):

```ts
export const getServicesPage = () => getIndexPage("services-page");
```

becomes (place it right after the `getIndexPage` function definition,
removing it from the group of one-line wrappers so
`getPortfolioPage`/`getGalleryPage`/`getSectorsPage` still read
`export const getPortfolioPage = () => getIndexPage("portfolio-page");`
etc. unchanged on the remaining lines):

```ts
export type ServicesPageContent = IndexPage & {
  heroSpecs: { accent: string; rest: string }[];
};

export async function getServicesPage(): Promise<ServicesPageContent> {
  const p = await payload();
  const g = asDoc(await p.findGlobal({ slug: "services-page", depth: 1 }));
  return {
    metaDescription: str(g?.metaDescription),
    eyebrow: str(g?.eyebrow),
    title: str(g?.title),
    intro: str(g?.intro),
    image: mediaUrl(g?.heroImage),
    cta: ctaOf(g?.cta),
    heroSpecs: arr(g?.heroSpecs).map((s) => ({
      accent: str(s.accent),
      rest: str(s.rest),
    })),
  };
}

export const getPortfolioPage = () => getIndexPage("portfolio-page");
export const getGalleryPage = () => getIndexPage("gallery-page");
export const getSectorsPage = () => getIndexPage("sectors-page");
```

- [ ] **Step 10: Use the field in `services/page.tsx`**

`src/app/(frontend)/services/page.tsx:59-63`, current:

```tsx
        specs={[
          { accent: "Theory", rest: "+ oral exam" },
          { accent: "Practical", rest: "on the yard" },
          { accent: "Certified", rest: "only when both passed" },
        ]}
```

becomes:

```tsx
        specs={
          servicesHero.heroSpecs.length > 0
            ? servicesHero.heroSpecs
            : [
                { accent: "Theory", rest: "+ oral exam" },
                { accent: "Practical", rest: "on the yard" },
                { accent: "Certified", rest: "only when both passed" },
              ]
        }
```

- [ ] **Step 11: Generate types**

Run: `npm run generate:types`. Expect it to complete without error and
update `src/payload-types.ts` with `proofRailHeading`/`proofRailIntro` on
`Home`, `whatsappNote` on `ContactPage`, and `heroSpecs` on
`ServicesPage`.

- [ ] **Step 12: Generate and inspect the migration**

Run: `npx payload migrate:create add-proof-rail-contact-services-fields`.

Read the generated file under `src/migrations/`. Confirm it contains ONLY
`ALTER TABLE ... ADD COLUMN` / `CREATE TABLE` statements (expect a new
`services_page_hero_specs` array table plus new nullable columns on
`home` and `contact_page`). If it contains anything else, STOP — report
BLOCKED with the full migration file contents.

- [ ] **Step 13: Apply the migration and verify**

Run: `npm run migrate`.
Run: `npm run lint` — expect clean.
Run: `npm run build` — expect green, all pages prerendering with fallback
copy identical to what was hardcoded before this task.

- [ ] **Step 14: Commit**

```bash
git add src/globals/Home.ts src/globals/ContactPage.ts src/globals/ServicesPage.ts src/lib/content.ts src/components/sections/proof-rail.tsx src/app/'(frontend)'/page.tsx src/app/'(frontend)'/contact/page.tsx src/app/'(frontend)'/services/page.tsx src/payload-types.ts src/migrations/
git commit -m "Add ProofRail heading/intro, Contact WhatsApp note, and Services hero specs as CMS fields"
```

---

### Task 7: Update the client editing guide

**Files:**
- Modify: `docs/client-editing-guide.md`

**Interfaces:** None — documentation only.

`docs/client-editing-guide.md` (added in the WIP commit `e404602`, before
this plan's schema work) walks a non-technical client through editing the
site, but doesn't mention the CTA band, ProofRail heading/intro, the
Contact WhatsApp note, or the Services hero specs — all newly editable
as of Tasks 5-6.

- [ ] **Step 1: Add a "Closing CTA band" entry to section 7**

In the "## 7. Editing the words on a page" section, after the bullet list
that defines Hero/Eyebrow/Heading/Intro/accent (currently ending at line
145 `- **Green word / accent** = the word shown in green for emphasis.`),
add:

```markdown
- **Closing CTA Band** = the big two-line call-to-action block near the
  bottom of Home, About, Training, Work, Gallery and Sectors pages
  ("Line 1" / "Line 2", an optional intro line, the button text, and
  whether the second button calls, WhatsApps, or is left off).
```

- [ ] **Step 2: Add the new fields to the quick-reference table**

In "## 10. Quick reference", add three rows to the table (after the
existing "Text on the contact page" row):

```markdown
| The closing call-to-action block on any page | that Page's own entry → **Closing CTA** tab |
| The "Real ground / Real machines / Real results" section on Home | Pages → **Home Page** → Sections → Proof rail heading/intro |
| The WhatsApp line on the Contact page | Pages → **Contact Page** → Details |
| The Theory/Practical/Certified row on the Training page | Pages → **Training Page** → Hero specs |
```

- [ ] **Step 2: Commit**

```bash
git add docs/client-editing-guide.md
git commit -m "docs: document the new CTA band, ProofRail, Contact and Services CMS fields"
```

---

## Notes for the controller (not a task)

After Task 5 and Task 6's migrations are applied, the new fields exist in
the database but are empty — every page still renders its exact original
hardcoded copy via the `||` fallback. The client can now go into `/admin`
and fill in the CTA band / ProofRail / WhatsApp note / hero specs fields
per page whenever they want to change that copy; nothing further is
required from this plan for that content to "go live" (the existing
`afterChange` revalidation hooks already cover these globals).
