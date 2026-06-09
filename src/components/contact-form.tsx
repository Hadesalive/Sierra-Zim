"use client";

import { useState } from "react";
import {
  WhatsappLogoIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { services, site, whatsappLink } from "@/lib/site";

const field =
  "w-full border border-line bg-paper px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-forest-600 focus:outline-none";
const labelCls = "label-mono mb-2 block text-ink-soft";

type Payload = { whatsapp: string; mailto: string };

export function ContactForm() {
  const [payload, setPayload] = useState<Payload | null>(null);

  function compose(form: HTMLFormElement): Payload {
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) || "").trim();
    const name = get("name");
    const org = get("organisation");
    const email = get("email");
    const phone = get("phone");
    const programme = get("programme");
    const message = get("message");

    const body = [
      "Hello SierraZim, I'd like to enquire about a training programme.",
      "",
      `Name: ${name}`,
      org && `Organisation: ${org}`,
      phone && `Phone: ${phone}`,
      email && `Email: ${email}`,
      programme && `Programme: ${programme}`,
      message && "",
      message && message,
    ]
      .filter(Boolean)
      .join("\n");

    const subject = `Training enquiry — ${name || "new"}`;
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    return { whatsapp: whatsappLink(body), mailto };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const p = compose(e.currentTarget);
    setPayload(p);
    window.open(p.whatsapp, "_blank", "noopener,noreferrer");
  }

  if (payload) {
    return (
      <div className="flex h-full flex-col items-start justify-center border border-line bg-paper-2 p-8">
        <CheckCircleIcon weight="fill" className="size-12 text-forest-600" />
        <h3 className="mt-5 font-display text-2xl font-bold text-ink">
          Your enquiry is ready to send.
        </h3>
        <p className="mt-3 max-w-sm leading-relaxed text-ink-soft">
          We&apos;ve opened WhatsApp with your details filled in — just hit send
          and we&apos;ll reply within 1 business day. If it didn&apos;t open, or
          you&apos;d rather use email:
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={payload.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] px-5 py-3 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-white"
          >
            <WhatsappLogoIcon weight="fill" className="size-4" />
            Open WhatsApp
          </a>
          <a
            href={payload.mailto}
            className="inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink/[0.04]"
          >
            <EnvelopeSimpleIcon weight="bold" className="size-4" />
            Email us instead
          </a>
        </div>
        <button
          type="button"
          onClick={() => setPayload(null)}
          className="label-mono mt-8 text-ink underline decoration-line-strong decoration-2 underline-offset-[6px] hover:decoration-safety-500"
        >
          Edit / send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-paper p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Full name
          </label>
          <input id="name" name="name" required className={field} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="organisation" className={labelCls}>
            Organisation
          </label>
          <input
            id="organisation"
            name="organisation"
            className={field}
            placeholder="Company / employer"
          />
        </div>
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
            Email <span className="normal-case opacity-60">(optional)</span>
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

      <div className="mt-5">
        <label htmlFor="programme" className={labelCls}>
          Programme of interest
        </label>
        <select id="programme" name="programme" className={field} defaultValue="">
          <option value="" disabled>
            Select a programme
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Not sure / multiple">Not sure / multiple</option>
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelCls}>
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={field}
          placeholder="Tell us how many drivers or operators you need trained, and where."
        />
      </div>

      <button
        type="submit"
        className="group mt-7 inline-flex items-center gap-2.5 bg-forest-800 px-7 py-4 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-paper transition-colors hover:bg-forest-700"
      >
        <WhatsappLogoIcon weight="fill" className="size-4" />
        Send via WhatsApp
      </button>

      <p className="mt-4 text-sm text-ink-soft">
        Prefer email? Write to{" "}
        <a
          href={`mailto:${site.email}`}
          className="font-medium text-forest-700 underline underline-offset-4"
        >
          {site.email}
        </a>{" "}
        or call{" "}
        <a
          href={`tel:${site.phonesE164[0]}`}
          className="font-medium text-forest-700 underline underline-offset-4"
        >
          {site.phones[0]}
        </a>
        .
      </p>
    </form>
  );
}
