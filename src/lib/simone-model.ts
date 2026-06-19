export type EngineKey = "product" | "customer" | "cash" | "skills";
export type DriverKey = "innovation" | "governance" | "interaction" | "culture";

export type SimComponent = {
  key: EngineKey | DriverKey;
  label: string;
  shortLabel: string;
  color: string;
  icon: string;
  purpose: string;
  prompt: string;
};

export type SimSpec = SimComponent & {
  inputs: string;
  process: string;
  outputs: string;
  feedback: string;
  metrics: string;
  status: "draft" | "learning" | "ready";
};

export type SimOneVenture = {
  id: string;
  name: string;
  idea: string;
  audience: string;
  intent: string;
  createdAt: string;
  updatedAt: string;
  engines: Record<EngineKey, SimSpec>;
  drivers: Record<DriverKey, SimSpec>;
  assumptions: string[];
  decisionGates: string[];
  experiments: string[];
  coherenceReview: string;
};

export const engines: SimComponent[] = [
  {
    key: "product",
    label: "Product / Service Engine",
    shortLabel: "Product",
    color: "#34c5f4",
    icon: "Box",
    purpose: "Transforms inputs into value people can use.",
    prompt: "What transformation does your venture perform, and how will quality improve?",
  },
  {
    key: "customer",
    label: "Customer Engine",
    shortLabel: "Customer",
    color: "#7dde45",
    icon: "Users",
    purpose: "Discovers, earns, serves, and deepens relationships.",
    prompt: "Who is coherently served, how do they find you, and how do relationships compound?",
  },
  {
    key: "cash",
    label: "Cash Engine",
    shortLabel: "Cash",
    color: "#ff3333",
    icon: "BadgeDollarSign",
    purpose: "Generates, allocates, and protects resource flows.",
    prompt: "How does value become sustainable cash, and where does cash strengthen the system?",
  },
  {
    key: "skills",
    label: "Skills Engine",
    shortLabel: "Skills",
    color: "#ffd400",
    icon: "BrainCircuit",
    purpose: "Builds the capability and memory every engine depends on.",
    prompt: "What capabilities must grow, be retained, and be amplified by technology?",
  },
];

export const drivers: SimComponent[] = [
  {
    key: "innovation",
    label: "Innovation Driver",
    shortLabel: "Innovation",
    color: "#8b7cff",
    icon: "Sparkles",
    purpose: "Senses change and turns uncertainty into experiments.",
    prompt: "Which weak signals and experiments should shape the next iteration?",
  },
  {
    key: "governance",
    label: "Governance Driver",
    shortLabel: "Governance",
    color: "#ffffff",
    icon: "GitBranch",
    purpose: "Sets decision rights, resource logic, and boundaries.",
    prompt: "Who decides what, by which evidence, and where must humans approve?",
  },
  {
    key: "interaction",
    label: "Interaction Driver",
    shortLabel: "Interaction",
    color: "#2de0e6",
    icon: "Radio",
    purpose: "Moves signal through the system with low noise.",
    prompt: "What information must flow between engines, customers, agents, and builders?",
  },
  {
    key: "culture",
    label: "Culture Driver",
    shortLabel: "Culture",
    color: "#ff8a3d",
    icon: "Orbit",
    purpose: "Maintains shared mental models and values under pressure.",
    prompt: "What beliefs, norms, and non-negotiables keep this venture coherent?",
  },
];

export function createVenture(input: {
  name: string;
  idea: string;
  audience: string;
  intent: string;
}): SimOneVenture {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: input.name.trim() || "Untitled venture",
    idea: input.idea.trim(),
    audience: input.audience.trim(),
    intent: input.intent.trim(),
    createdAt: now,
    updatedAt: now,
    engines: createSpecs(engines) as Record<EngineKey, SimSpec>,
    drivers: createSpecs(drivers) as Record<DriverKey, SimSpec>,
    assumptions: [
      "The problem is urgent enough that the right people will change behavior.",
      "The first offer can prove value before the full system is built.",
      "The founder can hold judgment while agents execute bounded tasks.",
    ],
    decisionGates: [
      "Proceed when one target user confirms the problem in their own words.",
      "Iterate when evidence is mixed but the engine map remains coherent.",
      "Stop or reframe when the weakest engine blocks all other progress.",
    ],
    experiments: [
      "Interview 5 coherent builders and map their language to SIM engines.",
      "Draft the smallest offer that tests Product and Customer engine fit.",
      "Review the first learning loop before assigning any autonomous agent work.",
    ],
    coherenceReview:
      "Human remains Meta-Controller. SimOne routes attention as Supervisory Controller. Agents only execute bounded Embodied Controller tasks inside explicit engine and driver boundaries.",
  };
}

function createSpecs(items: SimComponent[]) {
  return Object.fromEntries(
    items.map((item) => [
      item.key,
      {
        ...item,
        inputs: "",
        process: "",
        outputs: "",
        feedback: "",
        metrics: "",
        status: "draft",
      },
    ]),
  );
}

export function loadVentures(): SimOneVenture[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem("simone.ventures");
  if (!raw) return [];

  try {
    return JSON.parse(raw) as SimOneVenture[];
  } catch {
    return [];
  }
}

export function saveVenture(venture: SimOneVenture) {
  const ventures = loadVentures();
  const next = [
    { ...venture, updatedAt: new Date().toISOString() },
    ...ventures.filter((item) => item.id !== venture.id),
  ];
  window.localStorage.setItem("simone.ventures", JSON.stringify(next));
}

export function loadVenture(id: string): SimOneVenture | null {
  return loadVentures().find((venture) => venture.id === id) || null;
}
