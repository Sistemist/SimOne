"use client";

import { useEffect, useState } from "react";
import type { ElementType } from "react";
import Image from "next/image";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Command,
  GitBranch,
  Inbox,
  Layers3,
  MoreHorizontal,
  PackageCheck,
  Search,
  Settings2,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { SignupForm } from "@/components/signup-form";

const engines = [
  {
    id: "SIM-101",
    title: "Product Engine",
    subtitle: "Offer, roadmap, delivery",
    state: "Designing",
    icon: PackageCheck,
    color: "text-sky-300",
  },
  {
    id: "SIM-204",
    title: "Customer Engine",
    subtitle: "Discovery, trust, demand",
    state: "Learning",
    icon: UsersRound,
    color: "text-emerald-300",
  },
  {
    id: "SIM-318",
    title: "Cash Engine",
    subtitle: "Pricing, revenue, runway",
    state: "Testing",
    icon: CircleDollarSign,
    color: "text-amber-300",
  },
  {
    id: "SIM-407",
    title: "Skills Engine",
    subtitle: "Capability, learning, leverage",
    state: "Training",
    icon: BrainCircuit,
    color: "text-rose-300",
  },
];

const drivers = ["Innovation", "Governance", "Interaction", "Culture"];
const courseUrl = "https://www.sysdom.org/systems-intelligence-course";
const bookDownloadUrl = "https://maven.com/hankay";
const softEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const navLinks = [
  { href: "#alpha", label: "Product" },
  { href: "#paperclip", label: "Structure" },
  { href: "#rag", label: "Memory" },
];

const featureCards = [
  {
    title: "Engine-native planning",
    body: "Assign work to value engines instead of inherited departments.",
    kind: "layers",
  },
  {
    title: "Retrieval-first memory",
    body: "Bring in knowledge when the task needs it, not as prompt ballast.",
    kind: "speed",
  },
  {
    title: "Human meta-stewardship",
    body: "Agents operate; the builder holds coherence, intent, and judgment.",
    kind: "precision",
  },
];

const improvementCards = [
  {
    title: "From Paperclip to SIM-native structure",
    body: "Paperclip is an elegant base for agentic company building. SimOne changes the organizational assumption: agents are not CEO/CMO/CFO substitutes; they are stewards of Product, Customer, Cash, and Skills engines.",
  },
  {
    title: "A shared Systems Intelligence memory",
    body: "By default, agents should reason from the same SIM knowledge layer: the 26-chapter Conscious Systems playbook, the course architecture, and your venture-specific context.",
  },
  {
    title: "Less context ballast, more task-fit retrieval",
    body: "Instead of continually injecting full files and swollen memory into every agent run, SimOne is designed around retrieval-first context and human approval at engine boundaries.",
  },
];

const ragCards = [
  ["Course-grounded", "Agents inherit the Systems Intelligence course language instead of generic startup advice."],
  ["Venture-adaptive", "Your product, customer, cash, and skills data shape the working memory of each engine."],
  ["Creator-backed", "The base model is wired to SIM as taught by its creator, then adapted to the builder's real system."],
];

export function SimOneLanding() {
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setYOffset(Math.min(window.scrollY / 300, 1) * -20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden bg-[#09090b]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-[30%] bg-[radial-gradient(ellipse_at_center,rgba(113,112,255,0.12)_0%,transparent_70%)]" />
        <div className="relative z-10 flex flex-col pt-28">
          <div className="flex w-full justify-center px-6 pt-12 md:pt-16">
            <div className="w-full max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-sm text-zinc-400"
              >
                <Sparkles className="h-4 w-4 text-[#7170ff]" aria-hidden="true" />
                Systems Intelligence Model for AI-first companies
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl text-balance text-4xl font-medium leading-[1.08] text-white md:text-5xl lg:text-[56px]"
              >
                A conscious operating layer for AI-first companies.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400"
              >
                Build your next-generation company around the Systems Intelligence Model:
                four value engines, four coordination drivers, and AI agents that know how
                the whole system is supposed to work.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <a
                  href="#signup"
                  className="inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100"
                >
                  Join early access
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={courseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-fit items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
                >
                  <span className="text-zinc-500">New:</span>
                  Learn more about the SIM
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </motion.div>
            </div>
          </div>

          <div className="relative mt-8 h-[680px] w-screen left-1/2 -ml-[50vw] overflow-hidden md:mt-12 md:h-[720px]">
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-72 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
            <div
              className="relative h-full w-full"
              style={{
                transform: `translateY(${yOffset}px)`,
                transition: "transform 0.1s ease-out",
                contain: "strict",
                perspective: "4000px",
                perspectiveOrigin: "100% 0",
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: softEase }}
                className="absolute inset-x-0 top-0 mx-auto overflow-hidden rounded-[10px] border border-zinc-800 bg-[#09090b]"
                style={{
                  width: 1600,
                  height: 900,
                  marginTop: 150,
                  transformOrigin: "0 0",
                  backfaceVisibility: "hidden",
                  transform:
                    "translate(2%) scale(1.2) rotateX(47deg) rotateY(31deg) rotate(324deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <DashboardMockup />
              </motion.div>
            </div>
          </div>

          <FeatureCardsSection />
          <PaperclipSection />
          <RagSection />
          <SignupSection />
          <Footer />
        </div>
      </section>
    </main>
  );
}

function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md">
      <div className="flex w-full justify-center px-6 py-4">
        <div className="flex w-full max-w-4xl items-center justify-between">
          <a href="#" className="flex items-center">
            <Image
              src="/simone-logo.png"
              alt="SimOne"
              width={196}
              height={56}
              className="h-10 w-auto"
              priority
            />
          </a>
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-zinc-400 transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center">
            <a
              href="#signup"
              className="rounded-md border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-sm text-white transition hover:bg-zinc-700"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function DashboardMockup() {
  const panelVariants: Variants = {
    hidden: { opacity: 0, x: 100, y: -80 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 1.2, ease: softEase },
    },
  };

  return (
    <motion.div
      className="flex h-full w-full overflow-hidden bg-zinc-950"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.3, delayChildren: 0.5 } },
      }}
    >
      <motion.aside
        className="flex h-full w-[220px] shrink-0 flex-col border-r border-zinc-800/50 bg-zinc-900/80"
        variants={panelVariants}
      >
        <div className="border-b border-zinc-800/50 p-3">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Image src="/simone-logo.png" alt="SimOne" width={116} height={32} className="h-5 w-auto" />
            <ChevronDown className="ml-auto h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 rounded-md bg-zinc-800/50 px-2.5 py-1.5 text-xs text-zinc-500">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Search memory...</span>
            <span className="ml-auto rounded bg-zinc-700/50 px-1.5 py-0.5 text-[10px]">
              <Command className="inline h-3 w-3" aria-hidden="true" />K
            </span>
          </div>
        </div>
        <div className="space-y-0.5 px-3">
          <NavItem icon={Inbox} label="Inbox" badge={4} active />
          <NavItem icon={Layers3} label="Engine Map" />
          <NavItem icon={GitBranch} label="Driver Signals" />
        </div>
        <div className="mt-5 px-3">
          <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            SIM Engines
          </div>
          <div className="mt-1 space-y-0.5">
            {engines.map((engine) => (
              <NavItem key={engine.id} icon={engine.icon} label={engine.title.replace(" Engine", "")} />
            ))}
          </div>
        </div>
        <div className="mt-5 flex-1 px-3">
          <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Drivers
          </div>
          <div className="mt-1 space-y-0.5">
            {drivers.map((driver) => (
              <NavItem key={driver} icon={Settings2} label={driver} />
            ))}
          </div>
        </div>
      </motion.aside>

      <motion.div
        className="flex h-full w-[320px] shrink-0 flex-col border-r border-zinc-800/50 bg-zinc-900/40"
        variants={panelVariants}
      >
        <div className="flex items-center justify-between border-b border-zinc-800/50 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Engine Inbox</h3>
          <Sparkles className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        </div>
        <div className="scrollbar-hide flex-1 overflow-auto">
          {engines.map((engine, index) => (
            <InboxItem key={engine.id} engine={engine} active={index === 0} />
          ))}
          <InboxItem
            engine={{
              id: "MEM-022",
              title: "Dify knowledge bridge",
              subtitle: "Retrieval policy draft",
              state: "Memory",
              icon: Sparkles,
              color: "text-violet-300",
            }}
          />
          <InboxItem
            engine={{
              id: "CAD-009",
              title: "Course launch funnel",
              subtitle: "Signup loop + follow-up",
              state: "Launch",
              icon: BadgeCheck,
              color: "text-emerald-300",
            }}
          />
        </div>
      </motion.div>

      <motion.section className="flex h-full flex-1 flex-col overflow-hidden bg-zinc-950" variants={panelVariants}>
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/50 px-5 py-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-500">System</span>
            <span className="text-zinc-600">›</span>
            <span className="text-[#7170ff]">SIM OS</span>
            <span className="text-zinc-600">›</span>
            <span className="text-zinc-300">Product Engine</span>
          </div>
          <MoreHorizontal className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        </div>
        <div className="scrollbar-hide flex-1 overflow-auto p-5">
          <h2 className="mb-5 text-xl font-semibold text-white">
            Design the offer before assigning agents
          </h2>
          <div className="mb-5 rounded-lg border border-zinc-800/50 bg-zinc-900/80 p-4 font-mono text-[11px]">
            <div className="space-y-2">
              <div>
                <span className="text-zinc-500">Engine.</span>
                <span className="text-amber-300">product</span>
                <span className="text-zinc-400"> receives </span>
                <span className="text-cyan-300">customer.signal</span>
                <span className="text-zinc-400"> and returns validated offer hypotheses.</span>
              </div>
              <div className="text-zinc-600">
                <span>{"//"}</span> Context is retrieved from SIM + course docs only when relevant.
              </div>
              <div>
                <span className="text-purple-400">@driver</span>
                <span className="text-zinc-400">(</span>
                <span className="text-cyan-300">innovation</span>
                <span className="text-zinc-400">, </span>
                <span className="text-cyan-300">governance</span>
                <span className="text-zinc-400">, </span>
                <span className="text-cyan-300">interaction</span>
                <span className="text-zinc-400">, </span>
                <span className="text-cyan-300">culture</span>
                <span className="text-zinc-400">)</span>
              </div>
              <div>
                <span className="text-blue-400">human</span>
                <span className="text-zinc-400"> remains </span>
                <span className="text-emerald-400">meta_steward</span>
                <span className="text-zinc-400"> for judgment, coherence, and intent.</span>
              </div>
            </div>
          </div>
          <div className="mb-5 grid gap-3 md:grid-cols-2">
            {drivers.map((driver) => (
              <div key={driver} className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
                <div className="mb-2 text-xs uppercase tracking-wider text-zinc-500">{driver}</div>
                <p className="text-sm text-zinc-300">Live signal routed into the selected engine.</p>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-800/50 pt-4">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Activity</div>
            <ActivityItem name="Han" action="created" object="SimOne landing alpha" time="today" />
            <ActivityItem name="Codex" action="mapped" object="Paperclip roles to SIM engines" time="today" />
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

function NavItem({
  icon: Icon,
  label,
  badge,
  active = false,
}: {
  icon: ElementType;
  label: string;
  badge?: number;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
        active ? "bg-zinc-800 text-white" : "text-zinc-500"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
      {badge ? <span className="ml-auto rounded bg-[#7170ff] px-1.5 py-0.5 text-[10px] text-white">{badge}</span> : null}
    </div>
  );
}

function InboxItem({
  engine,
  active = false,
}: {
  engine: {
    id: string;
    title: string;
    subtitle: string;
    state: string;
    icon: ElementType;
    color: string;
  };
  active?: boolean;
}) {
  const Icon = engine.icon;

  return (
    <div className={`border-b border-zinc-800/40 p-4 ${active ? "bg-zinc-800/45" : ""}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-zinc-500">{engine.id}</span>
        <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">{engine.state}</span>
      </div>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-4 w-4 ${engine.color}`} aria-hidden="true" />
        <div>
          <h4 className="text-sm font-medium text-zinc-200">{engine.title}</h4>
          <p className="mt-1 text-xs text-zinc-500">{engine.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  name,
  action,
  object,
  time,
}: {
  name: string;
  action: string;
  object: string;
  time: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-3 text-sm">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-zinc-800 text-[10px] text-zinc-300">
        {name.slice(0, 1)}
      </span>
      <p className="text-zinc-500">
        <span className="text-zinc-300">{name}</span> {action}{" "}
        <span className="text-zinc-300">{object}</span>
      </p>
      <span className="ml-auto text-xs text-zinc-600">{time}</span>
    </div>
  );
}

function FeatureCardsSection() {
  return (
    <section id="alpha" className="relative z-20 bg-[#09090b] px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md text-3xl font-medium leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-[56px]"
          >
            Made for conscious builders, not org charts.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-md leading-7 text-zinc-400"
          >
            SimOne is the front door for testing whether SIM can become a practical agent-company
            interface for students, founders, and readers of the{" "}
            <a
              href={bookDownloadUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-white underline decoration-zinc-600 underline-offset-4 transition hover:decoration-white"
            >
              Conscious Systems book
            </a>{" "}
            (free download).
          </motion.p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
              className="group relative flex h-[360px] flex-col justify-end overflow-hidden rounded-[30px] border border-zinc-800 bg-zinc-900/50 transition hover:border-zinc-700"
            >
              <div
                className="absolute inset-x-0 top-0 flex h-[62%] items-center justify-center overflow-hidden"
                style={{
                  maskImage: "linear-gradient(#000 70%, transparent 92%)",
                  WebkitMaskImage: "linear-gradient(#000 70%, transparent 92%)",
                }}
              >
                <FeatureIllustration kind={card.kind} />
              </div>
              <div className="relative z-10 p-6 pb-9">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-medium text-white">{card.title}</h3>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-zinc-700 text-xl leading-none text-zinc-500 transition group-hover:border-zinc-500 group-hover:text-zinc-300">
                    +
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-500">{card.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIllustration({ kind }: { kind: string }) {
  if (kind === "speed") {
    return (
      <Image
        src="/images/speed-lines.png"
        alt=""
        width={600}
        height={360}
        className="h-full w-full object-cover opacity-80 invert"
      />
    );
  }

  if (kind === "precision") {
    return (
      <Image
        src="/images/precision-workflow.png"
        alt=""
        width={600}
        height={360}
        className="h-full w-full object-cover opacity-80 invert"
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="absolute top-8 h-56 w-40 rounded-[28px] border border-zinc-700/80 bg-zinc-800/30"
          style={{
            left: `${16 + item * 16}%`,
            transform: "skewY(-28deg)",
            opacity: 0.45 - item * 0.05,
          }}
        />
      ))}
    </div>
  );
}

function PaperclipSection() {
  return (
    <section id="paperclip" className="relative z-20 bg-[#09090b] px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-sm text-zinc-400">Built from the agent-company breakthrough, upgraded by SIM</span>
          <ChevronRight className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        </div>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-medium leading-[1.1] text-white sm:text-4xl md:text-5xl">
              Paperclip showed the pattern. SimOne changes the operating system.
            </h2>
            <p className="mt-6 leading-7 text-zinc-400">
              Traditional agent-company demos still tend to inherit old corporate categories.
              SimOne starts one layer deeper: design the system first, then let agents operate
              inside a conscious architecture.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800">
            {improvementCards.map((card) => (
              <article key={card.title} className="bg-zinc-950 p-6">
                <h3 className="text-lg font-medium text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RagSection() {
  return (
    <section id="rag" className="relative z-20 overflow-hidden bg-[#09090b] px-6 py-32">
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7170ff]" />
          <span className="text-sm text-zinc-400">Systems Intelligence Model RAG</span>
          <ChevronRight className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        </div>
        <h2 className="max-w-3xl text-3xl font-medium leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-[56px]">
          Every agent starts from the same map of the venture.
        </h2>
        <p className="mt-6 max-w-2xl leading-7 text-zinc-400">
          The Systems Intelligence Model gives agents a shared language for value creation:
          Product, Customer, Cash, and Skills engines, coordinated by Innovation, Governance,
          Interaction, and Culture drivers.
        </p>
        <div className="pointer-events-none relative left-1/2 z-0 mt-8 hidden h-[440px] w-screen -translate-x-1/2 overflow-hidden md:block lg:-mb-8 lg:h-[540px]" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#09090b] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent" />
          <div
            className="absolute left-1/2 top-[-18px] h-[640px] w-[1138px] opacity-30 grayscale lg:top-[-28px] lg:h-[720px] lg:w-[1280px]"
            style={{
              transform:
                "translateX(-58%) perspective(1800px) rotateX(62deg) rotateZ(-26deg) scale(1.16)",
              transformOrigin: "50% 10%",
            }}
          >
            <Image
              src="/sim-diagram.png"
              alt=""
              width={1920}
              height={1080}
              className="h-full w-full object-contain"
              sizes="100vw"
            />
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {ragCards.map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-lg font-medium text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 md:grid-cols-4">
          {engines.map((engine) => {
            const Icon = engine.icon;
            return (
              <article key={engine.id} className="bg-zinc-950/95 p-5">
                <div className="mb-8 flex items-center justify-between gap-3">
                  <Icon className={`h-5 w-5 ${engine.color}`} aria-hidden="true" />
                  <span className="rounded-full border border-zinc-800 px-2 py-1 text-[11px] text-zinc-500">
                    {engine.state}
                  </span>
                </div>
                <h3 className="text-base font-medium text-white">{engine.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{engine.subtitle}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-sm text-zinc-500">
          {drivers.map((driver) => (
            <span key={driver} className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1.5">
              {driver}
            </span>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 font-mono text-sm text-zinc-500">
          <div>
            <span className="text-zinc-600">simone.context</span>
            <span className="text-zinc-400"> = retrieve(</span>
            <span className="text-cyan-300">SIM</span>
            <span className="text-zinc-400"> + </span>
            <span className="text-amber-300">venture</span>
            <span className="text-zinc-400"> + </span>
            <span className="text-emerald-300">task</span>
            <span className="text-zinc-400">)</span>
          </div>
          <div className="mt-3 text-zinc-600">
            <span>{"//"}</span> Smaller prompts. Better shared memory. Clearer human approval at engine boundaries.
          </div>
        </div>
      </div>
    </section>
  );
}

function SignupSection() {
  return (
    <section id="signup" className="relative z-20 bg-[#09090b] px-6 py-28">
      <div className="mx-auto grid max-w-5xl items-start gap-10 border-y border-zinc-800 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-3xl font-medium text-white md:text-4xl lg:text-[42px]">
            Join the first SimOne early access list.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-zinc-400">
            We’ll use this list for alpha access, demo updates, and the first cohort learning loop.
            For the deeper framework, explore the{" "}
            <a
              href={courseUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-white underline decoration-zinc-600 underline-offset-4 transition hover:decoration-white"
            >
              Systems Intelligence course
            </a>
            .
          </p>
        </div>
        <SignupForm variant="dark" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#09090b] px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <Image
          src="/simone-logo.png"
          alt="SimOne"
          width={864}
          height={322}
          className="h-auto w-[132px] opacity-85 sm:w-[164px]"
        />
        <div className="space-y-1 sm:text-right">
          <p>Systems Intelligence for agent-native builders.</p>
          <p>© 2026 Systems Intelligence LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
