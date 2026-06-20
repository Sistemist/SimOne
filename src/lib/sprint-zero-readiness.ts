import type { SimOneVenture, SimSpec } from "./simone-model";

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
};

export function summarizeSprintZeroReadiness(venture: SimOneVenture): SprintZeroReadiness {
  const specs = [...Object.values(venture.engines), ...Object.values(venture.drivers)];
  const completedComponents = specs.filter(isCompleteSpec).length;
  const totalComponents = specs.length;
  const nextGaps = specs.flatMap((spec) => {
    return requiredFields
      .filter((field) => !String(spec[field] || "").trim())
      .map((field) => `${spec.shortLabel} needs ${field}`);
  });

  return {
    percent: Math.round((completedComponents / totalComponents) * 100),
    completedComponents,
    totalComponents,
    nextGaps: nextGaps.slice(0, 5),
  };
}

function isCompleteSpec(spec: SimSpec) {
  return requiredFields.every((field) => String(spec[field] || "").trim());
}
