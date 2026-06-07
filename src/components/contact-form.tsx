"use client";

import { useState } from "react";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { services, site } from "@/lib/site";

const field =
  "w-full border border-line bg-paper px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-forest-600 focus:outline-none";
const labelCls = "label-mono mb-2 block text-ink-soft";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "");
    const org = String(data.get("organisation") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const programme = String(data.get("programme") || "");
    const message = String(data.get("message") || "");

    const subject = `Training enquiry — ${name || "new"}`;
    const body = [
      `Name: ${name}`,
      `Organisation: ${org}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Programme of interest: ${programme}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex h-full flex-col items-start justify-center border border-line bg-paper-2 p-8">
        <CheckCircleIcon weight="fill" className="size-12 text-forest-600" />
        <h3 className="mt-5 font-display text-2xl font-bold text-ink">
          Your email is ready to send.
        </h3>
        <p className="mt-3 max-w-sm leading-relaxed text-ink-soft">
          We&apos;ve opened your email app with the details filled in — just press
          send. Prefer to talk? Call us on{" "}
          <a
            href={`tel:${site.phonesE164[0]}`}
            className="font-medium text-forest-700 underline underline-offset-4"
          >
            {site.phones[0]}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="label-mono mt-8 text-ink underline decoration-line-strong decoration-2 underline-offset-[6px] hover:decoration-safety-500"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-line bg-paper p-6 sm:p-8"
    >
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
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={field}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone
          </label>
          <input id="phone" name="phone" className={field} placeholder="+232 …" />
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
          required
          className={field}
          placeholder="Tell us how many drivers or operators you need trained, and where."
        />
      </div>

      <button
        type="submit"
        className="group mt-7 inline-flex items-center gap-2.5 bg-safety-500 px-7 py-4 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-safety-400"
      >
        Send enquiry
        <ArrowUpRightIcon
          weight="bold"
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>
    </form>
  );
}
