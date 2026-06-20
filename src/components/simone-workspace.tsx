"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Box,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleAlert,
  Download,
  GitBranch,
  Layers3,
  Orbit,
  Radio,
  Save,
  Sparkles,
  Users,
} from "lucide-react";

import type { AlphaUser } from "@/components/simone-account-bar";
import type { AiConfigStatus } from "@/lib/ai-config";
import {
  AgentRunDraft,
  createAgentRunDraft,
  loadAgentRuns,
  saveAgentRuns,
} from "@/lib/agent-runs";
import {
  DriverKey,
  EngineKey,
  SimOneVenture,
  SprintZeroItem,
  SprintZeroScope,
  drivers,
  engines,
  loadVenture,
  saveVenture,
} from "@/lib/simone-model";
import { summarizeSprintZeroReadiness } from "@/lib/sprint-zero-readiness";
import { createVentureExport, ventureExportFilename } from "@/lib/venture-transfer";

type SectionKey = EngineKey | DriverKey | "assumptions" | "gates" | "coherence";
type SyncState = "local" | "syncing" | "synced" | "unavailable" | "error";

const iconMap = {
  Box,
  Users,
  BadgeDollarSign,
  BrainCircuit,
  Sparkles,
  GitBranch,
  Radio,
  Orbit,
};

export function SimOneWorkspace({
  ventureId,
  alphaUser,
  persistenceReady,
  aiConfigStatus,
}: {
  ventureId: string;
  alphaUser?: AlphaUser | null;
  persistenceReady?: boolean;
  aiConfigStatus?: AiConfigStatus;
}) {
  const router = useRouter();
  const [venture, setVenture] = useState<SimOneVenture | null>(null);
  const [active, setActive] = useState<SectionKey>("product");
  const [saved, setSaved] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>(
    alphaUser ? (persistenceReady ? "syncing" : "unavailable") : "local",
  );
  const [agentRuns, setAgentRuns] = useState<AgentRunDraft[]>(() => loadAgentRuns(ventureId));

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const loadedVenture = loadVenture(ventureId);
      setVenture(loadedVenture);

      if (!loadedVenture) {
        router.replace("/app/onboarding");
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [router, ventureId]);

  useEffect(() => {
    if (!venture) return;
    const timeout = window.setTimeout(() => {
      saveVenture(venture);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1200);

      if (!alphaUser) {
        setSyncState("local");
        return;
      }

      if (!persistenceReady) {
        setSyncState("unavailable");
        return;
      }

      setSyncState("syncing");
      fetch("/api/ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venture }),
      })
        .then((response) => {
          if (response.ok) {
            setSyncState("synced");
            return;
          }

          setSyncState(response.status === 503 ? "unavailable" : "error");
        })
        .catch(() => setSyncState("error"));
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [alphaUser, persistenceReady, venture]);

  useEffect(() => {
    saveAgentRuns(ventureId, agentRuns);
  }, [agentRuns, ventureId]);

  function syncAgentRun(agentRun: AgentRunDraft) {
    if (!alphaUser || !persistenceReady || !venture) return;

    fetch("/api/ventures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venture }),
    })
      .then((response) => {
        if (!response.ok) return;

        return fetch("/api/agent-runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentRun }),
        });
      })
      .catch(() => {
        // The local approval ledger remains the source of continuity if cloud sync is interrupted.
      });
  }

  const completion = useMemo(() => {
    if (!venture) return 0;
    return summarizeSprintZeroReadiness(venture).percent;
  }, [venture]);
  const readiness = useMemo(() => {
    if (!venture) return null;
    return summarizeSprintZeroReadiness(venture);
  }, [venture]);

  function exportVenture() {
    if (!venture) return;

    const payload = JSON.stringify(createVentureExport(venture), null, 2);
    const url = window.URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = ventureExportFilename(venture);
    link.click();
    window.URL.revokeObjectURL(url);
  }

  if (!venture) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-zinc-400">
        Loading SimOne workspace...
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#09090b] text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-zinc-800 bg-zinc-950/80 lg:border-b-0 lg:border-r">
          <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-5">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/simone-logo.png"
                alt="SimOne"
                width={864}
                height={322}
                priority
                className="h-auto w-[108px]"
                style={{ height: "auto" }}
              />
            </Link>
            <span className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-500">
              Alpha
            </span>
          </div>

          <nav className="space-y-6 px-3 py-5">
            <NavGroup title="SIM Engines">
              {engines.map((item) => (
                <NavItem key={item.key} itemKey={item.key} active={active} setActive={setActive} />
              ))}
            </NavGroup>
            <NavGroup title="Drivers">
              {drivers.map((item) => (
                <NavItem key={item.key} itemKey={item.key} active={active} setActive={setActive} />
              ))}
            </NavGroup>
            <NavGroup title="Sprint Zero">
              <NavButton active={active === "assumptions"} onClick={() => setActive("assumptions")}>
                Assumptions
              </NavButton>
              <NavButton active={active === "gates"} onClick={() => setActive("gates")}>
                Decision gates
              </NavButton>
              <NavButton active={active === "coherence"} onClick={() => setActive("coherence")}>
                Coherence review
              </NavButton>
            </NavGroup>
          </nav>
        </aside>

        <section className="relative min-w-0">
          <header className="flex min-h-16 flex-col gap-4 border-b border-zinc-800 bg-zinc-950/40 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                System <ChevronRight size={15} /> SIM OS <ChevronRight size={15} />
                {activeLabel(active)}
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-white">{venture.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
                Sprint Zero {completion}% mapped
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400">
                {saved ? <Check size={15} className="text-emerald-400" /> : <Save size={15} />}
                {saved ? "Saved" : "Autosave"}
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
                {syncLabel(syncState)}
              </div>
              <button
                type="button"
                onClick={exportVenture}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                <Download size={15} aria-hidden="true" />
                Export
              </button>
            </div>
          </header>

          <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="space-y-6">
              <IntroCard venture={venture} />
              {renderActiveSection(active, venture, setVenture)}
            </section>
            <aside className="space-y-6">
              <SimCanvas active={active} setActive={setActive} />
              {readiness ? (
                <SprintZeroReviewCard readiness={readiness} setActive={setActive} />
              ) : null}
              <AgentBoundaryCard />
              <AgentQueueCard
                active={active}
                ventureId={venture.id}
                agentRuns={agentRuns}
                setAgentRuns={setAgentRuns}
                syncAgentRun={syncAgentRun}
              />
              <ReadinessCard aiConfigStatus={aiConfigStatus} />
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function IntroCard({ venture }: { venture: SimOneVenture }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="flex items-center gap-2 text-sm text-[#7170ff]">
        <Layers3 size={16} />
        Sprint Zero system map
      </div>
      <p className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white">
        {venture.idea}
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Signal label="Coherent audience" value={venture.audience} />
        <Signal label="Meta-intent" value={venture.intent} />
      </div>
    </section>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-zinc-600">{label}</div>
      <div className="mt-2 text-base leading-6 text-zinc-300">{value || "Not mapped yet."}</div>
    </div>
  );
}

function renderActiveSection(
  active: SectionKey,
  venture: SimOneVenture,
  setVenture: (venture: SimOneVenture) => void,
) {
  if (active === "assumptions") {
    return (
      <ListEditor
        title="Assumptions"
        note="Make the leap-of-faith assumptions explicit before building."
        items={venture.assumptions}
        addLabel="Add assumption"
        onChange={(items) => setVenture({ ...venture, assumptions: items })}
      />
    );
  }

  if (active === "gates") {
    return (
      <ListEditor
        title="Decision Gates"
        note="Define stop, iterate, proceed, and scale rules before emotion enters the room."
        items={venture.decisionGates}
        addLabel="Add gate"
        onChange={(items) => setVenture({ ...venture, decisionGates: items })}
      />
    );
  }

  if (active === "coherence") {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
        <SectionTitle
          title="Coherence Review"
          note="This is the Supervisory Controller surface. It checks whether agents, engines, and drivers still serve the founder's meta-intent."
        />
        <textarea
          value={venture.coherenceReview}
          onChange={(event) => setVenture({ ...venture, coherenceReview: event.target.value })}
          className="mt-5 min-h-52 w-full rounded-xl border border-zinc-800 bg-[#09090b] p-4 text-base leading-7 text-zinc-200 outline-none focus:border-zinc-600"
        />
      </section>
    );
  }

  const isEngine = active in venture.engines;
  const spec = isEngine ? venture.engines[active as EngineKey] : venture.drivers[active as DriverKey];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <SectionTitle title={spec.label} note={spec.prompt} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {[
          ["inputs", "Inputs"],
          ["process", "Process"],
          ["outputs", "Outputs"],
          ["feedback", "Feedback"],
          ["metrics", "Metrics"],
        ].map(([field, label]) => (
          <SpecField
            key={field}
            label={label}
            value={String(spec[field as keyof typeof spec] || "")}
            onChange={(value) => {
              const nextSpec = { ...spec, [field]: value };
              if (isEngine) {
                setVenture({
                  ...venture,
                  engines: { ...venture.engines, [active]: nextSpec },
                });
              } else {
                setVenture({
                  ...venture,
                  drivers: { ...venture.drivers, [active]: nextSpec },
                });
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ title, note }: { title: string; note: string }) {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-3xl text-base leading-7 text-zinc-400">{note}</p>
    </div>
  );
}

function SpecField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={label === "Metrics" ? "block md:col-span-2" : "block"}>
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-28 w-full rounded-xl border border-zinc-800 bg-[#09090b] p-3 text-base leading-6 text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
        placeholder={`Map ${label.toLowerCase()} for this component...`}
      />
    </label>
  );
}

function ListEditor({
  title,
  note,
  items,
  addLabel,
  onChange,
}: {
  title: string;
  note: string;
  items: SprintZeroItem[];
  addLabel: string;
  onChange: (items: SprintZeroItem[]) => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <SectionTitle title={title} note={note} />
      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-zinc-800 bg-[#09090b] p-3">
            <div className="grid gap-3 md:grid-cols-[180px_1fr_140px]">
              <label>
                <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">Scope</span>
                <select
                  value={item.scope}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = { ...item, scope: event.target.value as SprintZeroScope };
                    onChange(next);
                  }}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-600"
                >
                  {[...engines, ...drivers].map((scope) => (
                    <option key={scope.key} value={scope.key}>
                      {scope.shortLabel}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">Statement</span>
                <input
                  value={item.text}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = { ...item, text: event.target.value };
                    onChange(next);
                  }}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-base text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
                />
              </label>
              <label>
                <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">Status</span>
                <select
                  value={item.status}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = {
                      ...item,
                      status: event.target.value as SprintZeroItem["status"],
                    };
                    onChange(next);
                  }}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-600"
                >
                  <option value="draft">Draft</option>
                  <option value="testing">Testing</option>
                  <option value="resolved">Resolved</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange([
            ...items,
            {
              id: crypto.randomUUID(),
              scope: "product",
              text: "",
              status: "draft",
            },
          ])
        }
        className="mt-4 rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
      >
        {addLabel}
      </button>
    </section>
  );
}

function SimCanvas({
  active,
  setActive,
}: {
  active: SectionKey;
  setActive: (key: SectionKey) => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">SIM Map</h2>
        <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">Engines + drivers</span>
      </div>
      <div className="relative grid aspect-[1.15] grid-cols-2 grid-rows-2 gap-1 rounded-xl border border-zinc-800 bg-[#070708] p-2">
        {engines.map((engine) => (
          <button
            key={engine.key}
            type="button"
            onClick={() => setActive(engine.key)}
            className={`relative rounded-lg border p-3 text-left transition ${
              active === engine.key
                ? "bg-zinc-900 text-white"
                : "border-zinc-900 bg-transparent text-zinc-500 hover:bg-zinc-950 hover:text-zinc-300"
            }`}
            style={{ borderColor: active === engine.key ? engine.color : undefined }}
          >
            <span className="text-sm font-medium">{engine.shortLabel}</span>
            <span className="absolute bottom-3 right-3 h-2 w-2 rounded-full" style={{ background: engine.color }} />
          </button>
        ))}
        <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 text-center text-xs font-medium text-zinc-400">
          Laws &<br />Archetypes
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {drivers.map((driver) => (
          <button
            key={driver.key}
            type="button"
            onClick={() => setActive(driver.key)}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
              active === driver.key
                ? "border-zinc-500 bg-zinc-900 text-white"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {driver.shortLabel}
          </button>
        ))}
      </div>
    </section>
  );
}

function AgentBoundaryCard() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="flex items-center gap-2 text-sm text-amber-300">
        <CircleAlert size={16} />
        Agent boundary
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        Agents can draft, retrieve, summarize, and execute bounded tasks inside an engine. Any
        cross-engine commitment, cash implication, public claim, or customer promise requires human
        approval.
      </p>
    </section>
  );
}

function SprintZeroReviewCard({
  readiness,
  setActive,
}: {
  readiness: ReturnType<typeof summarizeSprintZeroReadiness>;
  setActive: (key: SectionKey) => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Check size={16} />
          Sprint Zero review
        </div>
        <span className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-500">
          {readiness.completedComponents}/{readiness.totalComponents}
        </span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-zinc-900">
        <div
          className="h-2 rounded-full bg-[#7170ff]"
          style={{ width: `${readiness.percent}%` }}
        />
      </div>
      <div className="mt-3 text-sm text-zinc-400">{readiness.percent}% mapped</div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <ReviewStat label="Testing" value={readiness.assumptionsTesting} />
        <ReviewStat label="Resolved" value={readiness.assumptionsResolved + readiness.decisionGatesResolved} />
        <ReviewStat label="Open" value={readiness.unresolvedEvidenceCount} />
      </div>
      {readiness.recommendedSection ? (
        <button
          type="button"
          onClick={() => setActive(readiness.recommendedSection?.key || "product")}
          className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-[#7170ff]/40 bg-[#7170ff]/10 p-3 text-left transition hover:border-[#8f8dff] hover:bg-[#7170ff]/15"
        >
          <span>
            <span className="block text-sm font-medium text-white">
              Open {readiness.recommendedSection.label}
            </span>
            <span className="mt-1 block text-xs leading-5 text-zinc-400">
              {readiness.recommendedSection.reason}
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-[#9f9dff]" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setActive("coherence")}
          className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-left transition hover:border-emerald-400/60"
        >
          <span>
            <span className="block text-sm font-medium text-white">Open coherence review</span>
            <span className="mt-1 block text-xs leading-5 text-zinc-400">
              All engine and driver fields are mapped.
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-emerald-300" aria-hidden="true" />
        </button>
      )}
      {readiness.nextGaps.length ? (
        <ul className="mt-4 space-y-2">
          {readiness.nextGaps.map((gap) => (
            <li key={gap} className="text-sm leading-5 text-zinc-500">
              {gap}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function ReviewStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-[#09090b] px-3 py-2">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="mt-0.5 text-xs text-zinc-500">{label}</div>
    </div>
  );
}

function AgentQueueCard({
  active,
  ventureId,
  agentRuns,
  setAgentRuns,
  syncAgentRun,
}: {
  active: SectionKey;
  ventureId: string;
  agentRuns: AgentRunDraft[];
  setAgentRuns: (runs: AgentRunDraft[]) => void;
  syncAgentRun: (run: AgentRunDraft) => void;
}) {
  const defaultScope = isSprintZeroScope(active) ? active : "product";

  function queueTask(formData: FormData) {
    const task = String(formData.get("task") || "");
    const scope = String(formData.get("scope") || defaultScope) as SprintZeroScope;
    if (!task.trim()) return;

    const run = createAgentRunDraft({ ventureId, scope, task });
    setAgentRuns([run, ...agentRuns]);
    syncAgentRun(run);
  }

  function approveTask(run: AgentRunDraft) {
    const approvedRun = {
      ...run,
      status: "approved" as const,
      humanApproval: "approved" as const,
      updatedAt: new Date().toISOString(),
    };

    setAgentRuns(agentRuns.map((item) => (item.id === run.id ? approvedRun : item)));
    syncAgentRun(approvedRun);
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="flex items-center gap-2 text-sm text-[#7170ff]">
        <Sparkles size={16} />
        Agent approval queue
      </div>
      <form
        action={queueTask}
        className="mt-4 space-y-3"
      >
        <select
          name="scope"
          defaultValue={defaultScope}
          className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-600"
        >
          {[...engines, ...drivers].map((scope) => (
            <option key={scope.key} value={scope.key}>
              {scope.shortLabel}
            </option>
          ))}
        </select>
        <textarea
          name="task"
          className="min-h-24 w-full rounded-lg border border-zinc-800 bg-[#09090b] p-3 text-sm leading-6 text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
          placeholder="Queue a bounded agent task..."
        />
        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-zinc-800 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
        >
          Queue for approval
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {agentRuns.slice(0, 3).map((run) => (
          <div key={run.id} className="rounded-xl border border-zinc-800 bg-[#09090b] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                {scopeLabel(run.scope)}
              </span>
              <span className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-500">
                {run.humanApproval === "approved" ? "Approved" : "Approval required"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{run.task}</p>
            {run.humanApproval !== "approved" ? (
              <button
                type="button"
                onClick={() => approveTask(run)}
                className="mt-3 text-sm font-medium text-zinc-200 transition hover:text-white"
              >
                Approve
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ReadinessCard({ aiConfigStatus }: { aiConfigStatus?: AiConfigStatus }) {
  const status = aiConfigStatus || {
    neon: { ready: false, missing: ["DATABASE_URL"] },
    dify: { ready: false, missing: ["DIFY_API_KEY", "DIFY_BASE_URL", "DIFY_SIM_KNOWLEDGE_ID"] },
    openRouter: { ready: false, missing: ["OPENROUTER_API_KEY"] },
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="flex items-center gap-2 text-sm text-zinc-300">
        <Radio size={16} />
        Connection readiness
      </div>
      <div className="mt-4 space-y-3">
        <ReadinessRow label="Neon" check={status.neon} />
        <ReadinessRow label="Dify" check={status.dify} />
        <ReadinessRow label="OpenRouter" check={status.openRouter} />
      </div>
    </section>
  );
}

function ReadinessRow({
  label,
  check,
}: {
  label: string;
  check: { ready: boolean; missing: string[] };
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        <span
          className={`rounded-md border px-2 py-1 text-xs ${
            check.ready
              ? "border-emerald-500/30 text-emerald-300"
              : "border-amber-500/30 text-amber-300"
          }`}
        >
          {check.ready ? "Ready" : "Needs config"}
        </span>
      </div>
      {!check.ready ? (
        <p className="mt-2 text-xs leading-5 text-zinc-500">{check.missing.join(", ")}</p>
      ) : null}
    </div>
  );
}

function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-2 text-xs uppercase tracking-[0.16em] text-zinc-600">{title}</div>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function NavItem({
  itemKey,
  active,
  setActive,
}: {
  itemKey: EngineKey | DriverKey;
  active: SectionKey;
  setActive: (key: SectionKey) => void;
}) {
  const item = [...engines, ...drivers].find((candidate) => candidate.key === itemKey);
  if (!item) return null;
  const Icon = iconMap[item.icon as keyof typeof iconMap];

  return (
    <button
      type="button"
      onClick={() => setActive(itemKey)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
        active === itemKey ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
      }`}
    >
      <Icon size={16} style={{ color: item.color }} />
      {item.shortLabel}
    </button>
  );
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
        active ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}

function activeLabel(active: SectionKey) {
  if (active === "assumptions") return "Assumptions";
  if (active === "gates") return "Decision Gates";
  if (active === "coherence") return "Coherence Review";
  return [...engines, ...drivers].find((item) => item.key === active)?.shortLabel || "Workspace";
}

function isSprintZeroScope(active: SectionKey): active is SprintZeroScope {
  return [...engines, ...drivers].some((item) => item.key === active);
}

function scopeLabel(scope: SprintZeroScope) {
  return [...engines, ...drivers].find((item) => item.key === scope)?.shortLabel || scope;
}

function syncLabel(state: SyncState) {
  if (state === "syncing") return "Syncing";
  if (state === "synced") return "Cloud synced";
  if (state === "unavailable") return "Neon needed";
  if (state === "error") return "Sync paused";
  return "Local only";
}
