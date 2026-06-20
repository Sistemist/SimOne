"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SimOneAccountBar, type AlphaUser } from "@/components/simone-account-bar";
import { createVenture, loadVentures, saveVenture } from "@/lib/simone-model";

export function SimOneOnboarding({ alphaUser }: { alphaUser?: AlphaUser | null }) {
  const router = useRouter();
  const [existingId] = useState<string | null>(() => loadVentures()[0]?.id || null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const venture = createVenture({
      name: String(form.get("name") || ""),
      idea: String(form.get("idea") || ""),
      audience: String(form.get("audience") || ""),
      intent: String(form.get("intent") || ""),
    });
    saveVenture(venture);
    router.push(`/app/ventures/${venture.id}`);
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <header className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/simone-logo.png"
            alt="SimOne"
            width={864}
            height={322}
            priority
            className="h-auto w-[132px]"
            style={{ height: "auto" }}
          />
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SimOneAccountBar alphaUser={alphaUser} syncNote={alphaUser ? "Ready to sync maps" : undefined} />
          {existingId ? (
            <Link
              href={`/app/ventures/${existingId}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-800 px-4 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              Return to workspace
            </Link>
          ) : null}
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="pt-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-[#7170ff]" />
            Sprint Zero Alpha
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-white md:text-7xl">
            Turn the idea into an instrumented system.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-400">
            SimOne starts with one venture and maps it into engines, drivers, metrics,
            decision gates, and coherence reviews before any agent is allowed to act.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {pillars.map(([label, body, Icon]) => (
              <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <Icon className="mb-5 h-5 w-5 text-[#7170ff]" aria-hidden="true" />
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="mt-1 text-sm leading-5 text-zinc-500">{body}</div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30"
        >
          <div className="border-b border-zinc-800 pb-5">
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Venture setup</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Create the first system map</h2>
          </div>

          <div className="grid gap-5 py-5">
            <Field
              label="Venture name"
              name="name"
              placeholder="Example: SimOne, Tissuu, Apple Masterclass..."
              required
            />
            <Field
              label="Idea"
              name="idea"
              textarea
              placeholder="What are you building, and what transformation should it create?"
              required
            />
            <Field
              label="Who is it for?"
              name="audience"
              textarea
              placeholder="Name the coherent people, not the broad market."
              required
            />
            <Field
              label="Meta-intent"
              name="intent"
              textarea
              placeholder="What must remain true as agents, tools, and workflows enter the system?"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
          >
            Open SIM workspace
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  textarea,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const className =
    "mt-2 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600";

  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      {textarea ? (
        <textarea
          className={`${className} min-h-24 py-3`}
          name={name}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          className={`${className} h-11`}
          name={name}
          placeholder={placeholder}
          required={required}
          type="text"
        />
      )}
    </label>
  );
}
  const pillars: Array<[string, string, LucideIcon]> = [
    ["Map", "SIM canvas first", Layers3],
    ["Gate", "Human approval at boundaries", ShieldCheck],
    ["Retrieve", "Dify knowledge, not prompt ballast", Sparkles],
  ];
