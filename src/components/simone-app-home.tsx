"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Layers3, Plus, ShieldCheck, Sparkles, Trash2, Upload } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { SimOneAccountBar, type AlphaUser } from "@/components/simone-account-bar";
import { deleteAgentRuns } from "@/lib/agent-runs";
import {
  SimOneVenture,
  createSampleVenture,
  deleteVenture,
  getWorkspaceEntryPath,
  loadVentures,
  saveVenture,
  saveVentures,
} from "@/lib/simone-model";
import { mergeVenturesByUpdatedAt } from "@/lib/venture-sync";
import { parseVentureExport } from "@/lib/venture-transfer";

export function SimOneAppHome({
  alphaUser,
  persistenceReady,
}: {
  alphaUser?: AlphaUser | null;
  persistenceReady?: boolean;
}) {
  const router = useRouter();
  const ventures = useSyncExternalStore(subscribeToVentureStorage, getClientVentures, getServerVentures);
  const primaryPath = useMemo(() => getWorkspaceEntryPath(ventures), [ventures]);
  const latest = ventures[0] || null;
  const [syncNote, setSyncNote] = useState(() =>
    alphaUser ? (persistenceReady ? "Checking cloud maps" : "Cloud storage needs Neon") : "Local alpha mode",
  );
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [importMessage, setImportMessage] = useState("");
  const accountSyncNote = alphaUser && !persistenceReady ? "Cloud storage needs Neon" : syncNote;

  useEffect(() => {
    if (!alphaUser || !persistenceReady) return;

    let active = true;

    fetch("/api/ventures")
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) {
          setSyncNote(response.status === 503 ? "Cloud storage needs Neon" : "Cloud sync unavailable");
          return;
        }

        const data = (await response.json()) as { ventures?: SimOneVenture[] };
        const merged = mergeVenturesByUpdatedAt(loadVentures(), data.ventures || []);
        saveVentures(merged);
        setSyncNote("Cloud maps merged");
      })
      .catch(() => {
        if (active) setSyncNote("Cloud sync unavailable");
      });

    return () => {
      active = false;
    };
  }, [alphaUser, persistenceReady]);

  function loadSampleVenture() {
    const venture = createSampleVenture();
    saveVenture(venture);
    router.push(`/app/ventures/${venture.id}`);
  }

  function removeVenture(ventureId: string) {
    deleteVenture(ventureId);
    deleteAgentRuns(ventureId);
  }

  async function importVenture(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = parseVentureExport(await file.text());
    event.target.value = "";

    if (!result.ok) {
      setImportMessage(result.message);
      return;
    }

    saveVenture({
      ...result.value,
      updatedAt: new Date().toISOString(),
    });
    router.push(`/app/ventures/${result.value.id}`);
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
          <SimOneAccountBar alphaUser={alphaUser} syncNote={accountSyncNote} />
          <Link
            href="/app/onboarding"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-800 px-4 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            <Plus size={16} aria-hidden="true" />
            New venture
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 pb-16 pt-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="pt-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-[#7170ff]" />
            SimOne Alpha Workspace
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-white md:text-7xl">
            Hold the venture as a system.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-400">
            Resume Sprint Zero, map the four value engines, and keep agents inside clear human
            approval boundaries.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryPath}
              className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
            >
              {latest ? "Resume workspace" : "Create first venture"}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            {!latest ? (
              <button
                type="button"
                onClick={loadSampleVenture}
                className="inline-flex h-12 w-fit items-center justify-center rounded-lg border border-zinc-800 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                Load sample venture
              </button>
            ) : null}
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              onChange={importVenture}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg border border-zinc-800 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              <Upload size={17} aria-hidden="true" />
              Import map
            </button>
            <Link
              href="/"
              className="inline-flex h-12 w-fit items-center justify-center rounded-lg border border-zinc-800 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              Back to landing
            </Link>
          </div>
          {importMessage ? <p className="mt-3 text-sm text-amber-300">{importMessage}</p> : null}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30">
          <div className="border-b border-zinc-800 pb-5">
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Current venture</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {latest ? latest.name : "No system map yet"}
            </h2>
          </div>

          {latest ? (
            <div className="grid gap-4 py-5">
              <WorkspaceSignal label="Idea" value={latest.idea} />
              <WorkspaceSignal label="Coherent audience" value={latest.audience} />
              <WorkspaceSignal label="Meta-intent" value={latest.intent} />
            </div>
          ) : (
            <div className="grid gap-3 py-5 sm:grid-cols-3">
              {emptyStateCards.map(([label, body, Icon]) => (
                <div key={label} className="rounded-xl border border-zinc-800 bg-[#09090b] p-4">
                  <Icon className="mb-5 h-5 w-5 text-[#7170ff]" aria-hidden="true" />
                  <div className="text-sm font-medium text-white">{label}</div>
                  <div className="mt-1 text-sm leading-5 text-zinc-500">{body}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-zinc-500">
              {ventures.length
                ? `${ventures.length} local alpha venture${ventures.length === 1 ? "" : "s"} saved in this browser.`
                : "Local alpha storage is active until Neon persistence is connected."}
            </p>
            <Link href={primaryPath} className="text-sm font-medium text-zinc-200 transition hover:text-white">
              Open flow
            </Link>
          </div>
        </div>
      </section>

      {ventures.length ? (
        <section className="mx-auto w-full max-w-7xl px-6 pb-16">
          <div className="border-t border-zinc-800 pt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-white">Recent ventures</h2>
              <span className="text-sm text-zinc-500">{ventures.length} saved locally</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {ventures.map((venture) => (
                <article key={venture.id} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white">{venture.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {venture.idea || "No idea mapped yet."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVenture(venture.id)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 transition hover:border-zinc-600 hover:text-white"
                      aria-label={`Delete ${venture.name}`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                  <Link
                    href={`/app/ventures/${venture.id}`}
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-zinc-800 px-4 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                  >
                    Open
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function WorkspaceSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-zinc-600">{label}</div>
      <div className="mt-2 text-base leading-6 text-zinc-300">{value || "Not mapped yet."}</div>
    </div>
  );
}

const emptyStateCards = [
  ["Map", "Create one venture system", Layers3],
  ["Gate", "Name human approval boundaries", ShieldCheck],
  ["Retrieve", "Prepare for grounded SIM memory", Sparkles],
] as const;

function subscribeToVentureStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("simone:ventures", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("simone:ventures", onStoreChange);
  };
}

function getServerVentures(): SimOneVenture[] {
  return emptyVentures;
}

let cachedRawVentures: string | null = null;
let cachedVentures: SimOneVenture[] = [];
const emptyVentures: SimOneVenture[] = [];

function getClientVentures() {
  const rawVentures = window.localStorage.getItem("simone.ventures");
  if (rawVentures === cachedRawVentures) return cachedVentures;

  cachedRawVentures = rawVentures;
  cachedVentures = loadVentures();
  return cachedVentures;
}
