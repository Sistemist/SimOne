"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { LogOut, UserRound } from "lucide-react";

export type AlphaUser = {
  email: string;
  name?: string | null;
};

export function SimOneAccountBar({
  alphaUser,
  syncNote,
}: {
  alphaUser?: AlphaUser | null;
  syncNote?: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setMessage("");

    const result = await signIn("credentials", {
      redirect: false,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
    });

    setPending(false);
    if (result?.error) {
      setMessage("Use a valid email to sync.");
      return;
    }

    router.refresh();
  }

  async function handleSignOut() {
    setPending(true);
    await signOut({ redirect: false });
    setPending(false);
    router.refresh();
  }

  if (alphaUser) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-2">
          <UserRound size={16} className="shrink-0 text-[#7170ff]" aria-hidden="true" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">{alphaUser.email}</div>
            <div className="text-xs text-zinc-500">{syncNote || "Alpha account active"}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={pending}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Sign out"
        >
          <LogOut size={15} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSignIn}
      className="grid gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 sm:grid-cols-[120px_190px_auto]"
    >
      <input
        name="name"
        placeholder="Name"
        className="h-9 rounded-lg border border-zinc-800 bg-[#09090b] px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="h-9 rounded-lg border border-zinc-800 bg-[#09090b] px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "..." : "Sync"}
      </button>
      {message ? <p className="text-xs text-amber-300 sm:col-span-3">{message}</p> : null}
    </form>
  );
}
