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

export type SprintZeroScope = EngineKey | DriverKey;

export type SprintZeroItem = {
  id: string;
  scope: SprintZeroScope;
  text: string;
  status: "draft" | "testing" | "resolved";
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
  assumptions: SprintZeroItem[];
  decisionGates: SprintZeroItem[];
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
      createSprintZeroItem(
        "customer",
        "The problem is urgent enough that the right people will change behavior.",
      ),
      createSprintZeroItem("product", "The first offer can prove value before the full system is built."),
      createSprintZeroItem("governance", "The founder can hold judgment while agents execute bounded tasks."),
    ],
    decisionGates: [
      createSprintZeroItem("customer", "Proceed when one target user confirms the problem in their own words."),
      createSprintZeroItem("innovation", "Iterate when evidence is mixed but the engine map remains coherent."),
      createSprintZeroItem("governance", "Stop or reframe when the weakest engine blocks all other progress."),
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

export function createSampleVenture(): SimOneVenture {
  const venture = createVenture({
    name: "Course Studio",
    idea: "A cohort product that helps conscious builders map an idea into a working system.",
    audience: "Founders learning the Systems Intelligence Model during the course alpha.",
    intent: "Keep human judgment as the Meta-Controller while agents support bounded learning loops.",
  });

  return {
    ...venture,
    engines: {
      ...venture.engines,
      product: {
        ...venture.engines.product,
        inputs: "Course framework, founder questions, SIM engine prompts, weekly exercises.",
        process: "Turn live venture uncertainty into Sprint Zero maps, experiments, and reviews.",
        outputs: "A completed first system map and a testable next offer.",
        feedback: "Student demos, friction notes, and weekly coherence reviews.",
        metrics: "Activation rate, completed system maps, demo readiness, learning-loop completion.",
        status: "learning",
      },
      customer: {
        ...venture.engines.customer,
        inputs: "Course students, book audience, Maven traffic, prior founder conversations.",
        process: "Recruit coherent builders and translate their language into engine-specific needs.",
        outputs: "Qualified alpha users and repeated problem language.",
        feedback: "Interview quotes, signup source, return visits, and workshop objections.",
        metrics: "Signup conversion, first-session completion, interview confirmation rate.",
        status: "learning",
      },
    },
    drivers: {
      ...venture.drivers,
      governance: {
        ...venture.drivers.governance,
        inputs: "Meta-intent, approval boundaries, agent task policy, launch risks.",
        process: "Keep cross-engine commitments under human review before public claims or cash decisions.",
        outputs: "Clear stop/iterate/proceed rules for each Sprint Zero loop.",
        feedback: "Decision log, unresolved risks, and human approval checkpoints.",
        metrics: "Reviewed gates, unresolved risk count, approvals before external commitments.",
        status: "learning",
      },
    },
    assumptions: [
      createSprintZeroItem("customer", "Course students will benefit from mapping their own venture in-session."),
      createSprintZeroItem("product", "A usable Sprint Zero map can create value before AI generation is connected."),
      createSprintZeroItem("governance", "Human approval boundaries make the alpha more trustworthy, not slower."),
    ],
    decisionGates: [
      createSprintZeroItem("customer", "Proceed when three students can explain their engine bottleneck in their own words."),
      createSprintZeroItem("product", "Iterate when the map is useful but a section feels abstract or hard to complete."),
      createSprintZeroItem("governance", "Stop or reframe before any agent output becomes a customer promise."),
    ],
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
    const ventures = JSON.parse(raw) as SimOneVenture[];
    return ventures.map(normalizeVenture);
  } catch {
    return [];
  }
}

export function saveVentures(ventures: SimOneVenture[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("simone.ventures", JSON.stringify(ventures));
  window.dispatchEvent(new Event("simone:ventures"));
}

export function saveVenture(venture: SimOneVenture) {
  const ventures = loadVentures();
  const next = [
    { ...venture, updatedAt: new Date().toISOString() },
    ...ventures.filter((item) => item.id !== venture.id),
  ];
  saveVentures(next);
}

export function removeVentureById(ventures: SimOneVenture[], ventureId: string) {
  return ventures.filter((venture) => venture.id !== ventureId);
}

export function updateSprintZeroItemStatus(
  items: SprintZeroItem[],
  itemId: string,
  status: SprintZeroItem["status"],
) {
  return items.map((item) => (item.id === itemId ? { ...item, status } : item));
}

export function deleteVenture(ventureId: string) {
  saveVentures(removeVentureById(loadVentures(), ventureId));
}

export function loadVenture(id: string): SimOneVenture | null {
  return loadVentures().find((venture) => venture.id === id) || null;
}

export function getWorkspaceEntryPath(ventures: Pick<SimOneVenture, "id">[]) {
  const firstVenture = ventures[0];
  return firstVenture ? `/app/ventures/${firstVenture.id}` : "/app/onboarding";
}

function createSprintZeroItem(scope: SprintZeroScope, text: string): SprintZeroItem {
  return {
    id: crypto.randomUUID(),
    scope,
    text,
    status: "draft",
  };
}

export function normalizeVenture(venture: SimOneVenture): SimOneVenture {
  return {
    ...venture,
    assumptions: normalizeSprintZeroItems(venture.assumptions, "customer"),
    decisionGates: normalizeSprintZeroItems(venture.decisionGates, "governance"),
  };
}

function normalizeSprintZeroItems(
  items: Array<SprintZeroItem | string>,
  fallbackScope: SprintZeroScope,
): SprintZeroItem[] {
  return items.map((item) => {
    if (typeof item === "string") {
      return createSprintZeroItem(fallbackScope, item);
    }

    return {
      ...item,
      scope: item.scope || fallbackScope,
      status: item.status || "draft",
    };
  });
}
