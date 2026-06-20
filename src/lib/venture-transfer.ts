import type { SimOneVenture, SprintZeroItem, SprintZeroScope } from "./simone-model";

export type VentureExport = {
  kind: "simone.venture";
  version: 1;
  exportedAt: string;
  venture: SimOneVenture;
};

type ParseResult =
  | { ok: true; value: SimOneVenture }
  | { ok: false; message: string };

export function createVentureExport(venture: SimOneVenture): VentureExport {
  return {
    kind: "simone.venture",
    version: 1,
    exportedAt: new Date().toISOString(),
    venture,
  };
}

export function parseVentureExport(payload: string): ParseResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(payload);
  } catch {
    return {
      ok: false,
      message: "Choose a valid SimOne venture export.",
    };
  }

  if (!isRecord(parsed) || parsed.kind !== "simone.venture") {
    return {
      ok: false,
      message: "This file is not a SimOne venture export.",
    };
  }

  if (!isRecord(parsed.venture)) {
    return {
      ok: false,
      message: "This file is missing a venture map.",
    };
  }

  return {
    ok: true,
    value: normalizeVentureForImport(parsed.venture as SimOneVenture),
  };
}

export function ventureExportFilename(venture: Pick<SimOneVenture, "name">) {
  const slug = venture.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

  return `simone-${slug || "venture"}.json`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeVentureForImport(venture: SimOneVenture): SimOneVenture {
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
      return {
        id: crypto.randomUUID(),
        scope: fallbackScope,
        text: item,
        status: "draft",
      };
    }

    return {
      ...item,
      scope: item.scope || fallbackScope,
      status: item.status || "draft",
    };
  });
}
