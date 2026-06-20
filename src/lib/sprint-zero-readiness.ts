import type { SimOneVenture, SimSpec, SprintZeroItem, SprintZeroScope } from "./simone-model";

const requiredFields: Array<keyof Pick<SimSpec, "inputs" | "process" | "outputs" | "feedback" | "metrics">> = [
  "inputs",
  "process",
  "outputs",
  "feedback",
  "metrics",
];

export type SprintZeroReadiness = {
  percent: number;
  completedComponents: number;
  totalComponents: number;
  nextGaps: string[];
  recommendedSection: {
    key: SprintZeroScope;
    label: string;
    missingField: keyof Pick<SimSpec, "inputs" | "process" | "outputs" | "feedback" | "metrics">;
    reason: string;
  } | null;
  assumptionsTesting: number;
  assumptionsResolved: number;
  decisionGatesResolved: number;
  unresolvedEvidenceCount: number;
};

export function summarizeSprintZeroReadiness(venture: SimOneVenture): SprintZeroReadiness {
  const specs = [...Object.values(venture.engines), ...Object.values(venture.drivers)];
  const completedComponents = specs.filter(isCompleteSpec).length;
  const totalComponents = specs.length;
  const recommendedGap = findRecommendedGap(specs);
  const nextGaps = specs.flatMap((spec) => {
    return requiredFields
      .filter((field) => !String(spec[field] || "").trim())
      .map((field) => `${spec.shortLabel} needs ${field}`);
  });
  const assumptionsTesting = countByStatus(venture.assumptions, "testing");
  const assumptionsResolved = countByStatus(venture.assumptions, "resolved");
  const decisionGatesResolved = countByStatus(venture.decisionGates, "resolved");

  return {
    percent: Math.round((completedComponents / totalComponents) * 100),
    completedComponents,
    totalComponents,
    nextGaps: nextGaps.slice(0, 5),
    recommendedSection: recommendedGap
      ? {
          key: recommendedGap.spec.key,
          label: recommendedGap.spec.shortLabel,
          missingField: recommendedGap.missingField,
          reason: `${recommendedGap.spec.shortLabel} needs ${recommendedGap.missingField} before Sprint Zero can judge the system loop.`,
        }
      : null,
    assumptionsTesting,
    assumptionsResolved,
    decisionGatesResolved,
    unresolvedEvidenceCount:
      venture.assumptions.length +
      venture.decisionGates.length -
      assumptionsResolved -
      decisionGatesResolved,
  };
}

function isCompleteSpec(spec: SimSpec) {
  return requiredFields.every((field) => String(spec[field] || "").trim());
}

function findRecommendedGap(specs: SimSpec[]) {
  for (const spec of specs) {
    const missingField = requiredFields.find((field) => !String(spec[field] || "").trim());
    if (missingField) {
      return { spec, missingField };
    }
  }

  return null;
}

function countByStatus(items: SprintZeroItem[], status: SprintZeroItem["status"]) {
  return items.filter((item) => item.status === status).length;
}
