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
  GitBranch,
  Layers3,
  Orbit,
  Radio,
  Save,
  Sparkles,
  Users,
} from "lucide-react";

import {
  DriverKey,
  EngineKey,
  SimOneVenture,
  drivers,
  engines,
  loadVenture,
  saveVenture,
} from "@/lib/simone-model";

type SectionKey = EngineKey | DriverKey | "assumptions" | "gates" | "coherence";

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

export function SimOneWorkspace({ ventureId }: { ventureId: string }) {
  const router = useRouter();
  const [venture, setVenture] = useState<SimOneVenture | null>(() => loadVenture(ventureId));
  const [active, setActive] = useState<SectionKey>("product");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!venture) {
      router.replace("/app/onboarding");
    }
  }, [router, venture]);

  useEffect(() => {
    if (!venture) return;
    const timeout = window.setTimeout(() => {
      saveVenture(venture);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1200);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [venture]);

  const completion = useMemo(() => {
    if (!venture) return 0;
    const specs = [...Object.values(venture.engines), ...Object.values(venture.drivers)];
    const filled = specs.filter(
      (spec) => spec.inputs && spec.process && spec.outputs && spec.feedback && spec.metrics,
    ).length;
    return Math.round((filled / specs.length) * 100);
  }, [venture]);

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
                width={108}
                height={43}
                priority
                style={{ width: "108px", height: "auto" }}
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
            </div>
          </header>

          <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="space-y-6">
              <IntroCard venture={venture} />
              {renderActiveSection(active, venture, setVenture)}
            </section>
            <aside className="space-y-6">
              <SimCanvas active={active} setActive={setActive} />
              <AgentBoundaryCard />
              <DifyCard />
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
  onChange,
}: {
  title: string;
  note: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <SectionTitle title={title} note={note} />
      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <input
            key={index}
            value={item}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
            className="h-12 w-full rounded-xl border border-zinc-800 bg-[#09090b] px-3 text-base text-zinc-200 outline-none focus:border-zinc-600"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-4 rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
      >
        Add line
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

function DifyCard() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="flex items-center gap-2 text-sm text-[#7170ff]">
        <Sparkles size={16} />
        Dify retrieval path
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        SimOne will retrieve from the cloned SIM knowledge base and a separate operational knowledge
        set. Until keys are connected, this workspace keeps the workflow explicit without fake AI
        output.
      </p>
    </section>
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
