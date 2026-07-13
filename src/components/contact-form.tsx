"use client";

import { useState } from "react";
import {
  WhatsappLogoIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { SiteSettings } from "@/lib/content";

// v2 "docket" field + label styles
const field =
  "w-full border-2 border-line-strong bg-paper px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-soft/55 focus:[outline:3px_solid_var(--color-safety-500)] focus:[outline-offset:-1px]";
const labelCls =
  "mb-2 block font-mono text-[10.5px] uppercase tracking-[0.22em] text-safety-600";

type Payload = { whatsapp: string; mailto: string };

export function ContactForm({
  site,
  programmes,
}: {
  site: SiteSettings;
  programmes: string[];
}) {
  const [payload, setPayload] = useState<Payload | null>(null);

  function compose(form: HTMLFormElement): Payload {
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) || "").trim();
    const name = get("name");
    const org = get("organisation");
    const email = get("email");
    const phone = get("phone");
    const programme = get("programme");
    const people = get("people");
    const message = get("message");

    const body = [
      "Hello SierraZim, I'd like to enquire about a training programme.",
      "",
      `Name: ${name}`,
      org && `Organisation: ${org}`,
      phone && `Phone: ${phone}`,
      email && `Email: ${email}`,
      programme && `Programme: ${programme}`,
      people && `People to train: ${people}`,
      message && "",
      message && message,
    ]
      .filter(Boolean)
      .join("\n");

    const subject = `Training enquiry — ${name || "new"}`;
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    const whatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(body)}`;
    return { whatsapp, mailto };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const p = compose(e.currentTarget);
    setPayload(p);
    window.open(p.whatsapp, "_blank", "noopener,noreferrer");
  }

  if (payload) {
    return (
      <div className="flex h-full flex-col items-start justify-center border-[3px] border-ink bg-paper-2 p-8 sm:p-10">
        <CheckCircleIcon weight="fill" className="size-12 text-forest-700" />
        <h3 className="mt-5 font-display text-[32px] font-extrabold uppercase leading-none text-ink">
          Enquiry ready to send ✓
        </h3>
        <p className="mt-4 max-w-sm leading-relaxed text-ink-soft">
          We&apos;ve opened WhatsApp with your details filled in — just hit send
          and we&apos;ll reply within one business day. If it didn&apos;t open, or
          you&apos;d rather use email:
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={payload.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-forest-950 px-6 py-3.5 font-display text-[17px] font-extrabold uppercase tracking-[0.06em] text-white transition-colors hover:bg-forest-900"
          >
            <WhatsappLogoIcon weight="fill" className="size-5 text-safety-400" />
            Open WhatsApp
          </a>
          <a
            href={payload.mailto}
            className="inline-flex items-center gap-2.5 border-2 border-ink px-6 py-3 font-display text-[17px] font-bold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-paper-3"
          >
            <EnvelopeSimpleIcon weight="bold" className="size-5" />
            Email instead
          </a>
        </div>
        <button
          type="button"
          onClick={() => setPayload(null)}
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-ink underline decoration-line-strong decoration-2 underline-offset-[6px] hover:decoration-safety-500"
        >
          Edit / send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-[3px] border-ink">
      {/* Docket header bar */}
      <div className="flex items-center justify-between gap-4 bg-ink px-6 py-4 text-white sm:px-7">
        <span className="font-display text-[22px] font-extrabold uppercase tracking-[0.06em]">
          Training enquiry
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-safety-400">
          Reply in 1 business day
        </span>
      </div>

      <div className="flex flex-col gap-5 bg-paper p-6 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>
              Your name
            </label>
            <input id="name" name="name" required className={field} placeholder="Full name" />
          </div>
          <div>
            <label htmlFor="organisation" className={labelCls}>
              Company / organisation
            </label>
            <input
              id="organisation"
              name="organisation"
              className={field}
              placeholder="Company name"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelCls}>
              Phone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required
              className={field}
              placeholder="+232 …"
            />
          </div>
          <div>
            <label htmlFor="email" className={labelCls}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={field}
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1.4fr_0.6fr]">
          <div>
            <label htmlFor="programme" className={labelCls}>
              Programme
            </label>
            <select id="programme" name="programme" className={field} defaultValue="">
              <option value="" disabled>
                Select a programme
              </option>
              {programmes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
              <option value="Not sure — advise us">Not sure — advise us</option>
            </select>
          </div>
          <div>
            <label htmlFor="people" className={labelCls}>
              People
            </label>
            <input
              id="people"
              name="people"
              type="number"
              min={1}
              inputMode="numeric"
              className={field}
              placeholder="e.g. 12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className={labelCls}>
            Tell us about the job
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`${field} resize-y`}
            placeholder="Location, vehicles or equipment, timeline…"
          />
        </div>

        <button
          type="submit"
          className="mt-1 inline-flex items-center justify-center gap-3 bg-safety-500 px-8 py-4 font-display text-[21px] font-extrabold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-safety-400"
        >
          Send enquiry
          <ArrowRightIcon weight="bold" className="size-[18px]" />
        </button>
      </div>
    </form>
  );
}
