"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type Status =
  | { kind: "idle"; message: "" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function SignupForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDark = variant === "dark";
  const inputClass = isDark
    ? "mt-2 h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 focus:bg-zinc-900"
    : "mt-2 h-11 w-full rounded-md border border-[#d8d3c7] bg-[#fbfaf7] px-3 text-base outline-none transition placeholder:text-[#9c9689] focus:border-[#171614] focus:bg-white";
  const labelClass = isDark ? "text-sm font-medium text-zinc-300" : "text-sm font-medium text-[#393630]";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "idle", message: "" });
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(formData.get("email") || ""),
          name: String(formData.get("name") || ""),
          useCase: String(formData.get("useCase") || ""),
          source: "simone-landing",
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus({
          kind: "error",
          message: payload.message || "Something did not submit. Please try again.",
        });
        return;
      }

      form.reset();
      setStatus({
        kind: "success",
        message: "You are on the SimOne early access list.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Network hiccup. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isDark
          ? "rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-2xl shadow-black/20"
          : "rounded-lg border border-[#d8d3c7] bg-white p-5 shadow-sm"
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Name</span>
          <input
            className={inputClass}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className={labelClass}>Email</span>
          <input
            className={inputClass}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className={labelClass}>What would you use SimOne for?</span>
        <textarea
          className={
            isDark
              ? "mt-2 min-h-28 w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 focus:bg-zinc-900"
              : "mt-2 min-h-28 w-full resize-y rounded-md border border-[#d8d3c7] bg-[#fbfaf7] px-3 py-3 text-base outline-none transition placeholder:text-[#9c9689] focus:border-[#171614] focus:bg-white"
          }
          name="useCase"
          placeholder="Course project, founder operating system, agent-company experiment..."
        />
      </label>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-sm leading-6 ${isDark ? "text-zinc-500" : "text-[#6f6a60]"}`}>
          No spam. We will use this list for alpha access and launch updates.
        </p>
        <button
          className={
            isDark
              ? "inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              : "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#171614] px-4 text-sm font-semibold text-white transition hover:bg-[#30302c] disabled:cursor-not-allowed disabled:opacity-60"
          }
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Joining
            </>
          ) : (
            <>
              Join early access
              <ArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      {status.kind !== "idle" ? (
        <div
          className={`mt-4 flex items-start gap-2 rounded-md border px-3 py-3 text-sm ${
            status.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
          role="status"
        >
          {status.kind === "success" ? <CheckCircle2 size={17} aria-hidden="true" /> : null}
          <span>{status.message}</span>
        </div>
      ) : null}
    </form>
  );
}
