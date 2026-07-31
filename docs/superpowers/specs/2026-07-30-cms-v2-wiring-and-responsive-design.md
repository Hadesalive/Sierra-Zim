# CMS wiring for the v2 redesign + responsive hardening — Design Spec

**Authored autonomously** per explicit user instruction ("use sub agent driven
approach to get this done with no input from me"). Normally this spec would
go through a clarifying-question dialogue; here the decisions below are my
best judgment, made from a full codebase audit, documented so they're
reviewable after the fact rather than before.

## Problem

The v2 "safety-yard" redesign (Home + Gallery pages already shipped; About,
Training/Services, Work/Portfolio, Contact just committed as WIP in
`e404602`) has two gaps:

1. **CMS coverage regressed during the redesign.** An editor-facing audit
   found: real headline copy that's fetched from Payload but never rendered
   (pure wiring bugs), one shared component (`CtaBand`) used on 6 pages with
   zero CMS field anywhere, and a handful of smaller hardcoded strings
   (a ProofRail heading, a Contact page paragraph, a Services hero spec
   list).
2. **Responsive behavior hasn't been verified since the redesign.** A
   dedicated audit found the codebase already disciplined about responsive
   prefixes — no "always breaks" bugs — but two real content-dependent
   risks (a `clamp()` floor that stops shrinking below ~700px/509px
   viewport width, applied to single-word CMS-editable headline spans with
   no wrap fallback) and several defensive hardening opportunities (fixed
   120px/112px section padding with no mobile scale-down, an unconstrained
   stat-number width, an unwrapped route-line flex row).

## Decisions

- **In scope:** every gap in the "High-value gaps" and "Your original
  finding" sections of the CMS audit, plus the "Breaks layout" and "Looks
  bad but functional" items from the responsive audit.
- **Out of scope, deliberately:**
  - The orphaned `Home` global fields (`whyUsEyebrow/Heading/Intro`,
    `workEyebrow/Heading`, `galleryEyebrow/Heading`, `faqEyebrow/Heading`)
    and the dead components/collections behind them (`why-us.tsx`,
    `work-preview.tsx`, `gallery-preview.tsx`, `faq.tsx`, `Faqs`,
    `ValueProps`). Removing these is a schema-deletion decision with no
    urgency — leaving them costs nothing, deleting them is harder to
    reverse. Flagged for the user as a follow-up, not touched here.
  - The long tail of "Medium" hardcoded button labels and repeated table
    column headers (`"View programme"`, `"Enrol now"`, `"Client/Sector/
    Scope/Result"`, etc.). Per the audit's own framing these are
    structural chrome, not content that changes — making them all
    CMS-editable would bloat the schema for no real editorial benefit
    (YAGNI).
  - The "Nitpick" responsive items (decorative numeral offset, docket
    column width margin, header dual-chrome window) — cosmetic, no
    functional risk.
- **CTA band schema shape:** one reusable field group (`ctaBandFields()`
  helper in `src/fields/shared.ts`) — `title` (text), `titleAccent` (text,
  rendered in the accent color/weight), `intro` (textarea), `primaryLabel`
  (text), `secondaryLabel` (text) — added to `Home` and all five index-page
  globals (`AboutPage` doesn't currently have a CTA band per the audit —
  confirmed it does via `about/page.tsx:239` with no props, so it's
  included too). Every field falls back to the component's current
  hardcoded string when empty, so no page can go blank from an empty CMS
  field, matching the existing fallback convention everywhere else in this
  codebase.
- **Migration safety (hard constraint, non-negotiable in every task):**
  this project's local dev environment reads/writes the **same live Neon
  Postgres database as production** (confirmed in `src/payload.config.ts`
  and prior deploy notes) — there is no separate dev database. Schema
  changes in this work are **purely additive** (new nullable fields on
  existing collections/globals; no renames, no drops, no type changes) by
  design, specifically because additive changes are non-destructive and
  don't trigger Payload/Drizzle's interactive rename-vs-create prompt.
  Every schema-changing task must:
  1. Add the field(s) to the relevant collection/global TypeScript file.
  2. Run `npm run generate:types` (safe — reads config, not the DB).
  3. Run `npx payload migrate:create <descriptive-name>` (introspects the
     live DB schema and diffs against code — read-only against the DB,
     writes a local migration file).
  4. **Read the generated migration file.** If it contains anything other
     than `CREATE TABLE` / `ALTER TABLE ... ADD COLUMN` statements (any
     `DROP`, `RENAME`, `ALTER COLUMN ... TYPE`), STOP — do not apply it,
     report BLOCKED with the file contents.
  5. If additive-only, apply it with `npm run migrate` (`payload migrate`),
     then verify with `npm run build`.
  - **Never run** `npm run dev` / `next dev` (Payload's dev-mode schema
    "push" would prompt interactively against the live DB and cannot be
    trusted non-interactively), and **never run** `scripts/seed.ts` (it
    clears live content collections — confirmed destructive in
    `docs/deploy.md`).
- **Verification standard:** no automated test suite exists in this repo.
  "Tests" for every task means: `npm run lint` clean, `npm run build`
  green (30+ pages prerender successfully against the live Neon content —
  this is a read-only build, safe), and `npm run generate:types` producing
  no TypeScript errors downstream. Tasks touching visual/responsive
  behavior additionally describe the specific viewport/element to
  eyeball-check in the task text (no browser automation available to
  subagents in this flow).

## Architecture

No structural change — same Next.js App Router + Payload-embedded-in-Next
architecture. Work is organized as 7 sequential tasks (subagent-driven-development
requires strict sequencing — no parallel implementers):

1. Wiring bug fixes (no schema change) — render already-fetched hero
   titles, fix the field-record headline, make the programmes-accordion
   second line CMS-driven.
2. Responsive: fix the headline `clamp()` floor + add wrap safety.
3. Responsive: scale fixed vertical section padding for mobile.
4. Responsive: defensive hardening (stat-plate width, route-line wrap,
   docket column width).
5. CMS: add the CTA band schema + wire all 6 call sites + migration.
6. CMS: add the remaining small fields (ProofRail heading/intro, Contact
   WhatsApp note, Services hero specs) + migration.
7. Update `docs/client-editing-guide.md` to describe the new editable
   fields (it currently doesn't mention CTA bands at all).

Ordering rationale: pure bug fixes first (lowest risk, unblocks nothing
else). Responsive tasks next since they touch different files than the
CMS-schema tasks and have no dependency on them. CMS-schema tasks last,
in increasing order of surface area, so the highest-review-value change
(CTA band, touching 6 pages) gets full attention with a clean baseline
behind it. Docs last, since it needs to describe the final field set.

## Data flow

No change to the existing pattern: Payload globals/collections →
`src/lib/content.ts` getters (typed, already the single read path) →
page Server Components → section components as props, with every text
field falling back to a hardcoded default (existing convention, e.g.
`home.heroTitleLine1 || "Trained."}`) — new fields follow this exact
convention so a blank CMS field never breaks a page.

## Testing

Per-task `npm run build` + `npm run lint`; schema tasks additionally
`npm run generate:types` and the migration safety gate above. No unit
test framework exists in this repo (Next.js starter default) — this is
consistent with the existing codebase, not a gap introduced here.
