import type { SimOneVenture, SprintZeroItem, SprintZeroScope } from "./simone-model";

const engineKeys = ["product", "customer", "cash", "skills"];
const driverKeys = ["innovation", "governance", "interaction", "culture"];

type VentureApiPayloadResult =
  | { ok: true; value: SimOneVenture }
  | { ok: false; status: 400 | 422; message: string };

export function normalizeVentureApiPayload(payload: unknown): VentureApiPayloadResult {
  const rawPayload = isRecord(payload) && "venture" in payload ? payload.venture : payload;

  if (!isRecord(rawPayload)) {
    return {
      ok: false,
      status: 400,
      message: "A venture payload is required.",
    };
  }

  if (!isCompleteVenturePayload(rawPayload)) {
    return {
      ok: false,
      status: 422,
      message: "The venture payload is incomplete.",
    };
  }

  return {
    ok: true,
    value: normalizeVentureForApi(rawPayload as SimOneVenture),
  };
}

function isCompleteVenturePayload(value: Record<string, unknown>) {
  return (
    isFilledString(value.id) &&
    isFilledString(value.name) &&
    typeof value.idea === "string" &&
    typeof value.audience === "string" &&
    typeof value.intent === "string" &&
    isFilledString(value.createdAt) &&
    isFilledString(value.updatedAt) &&
    hasRequiredKeys(value.engines, engineKeys) &&
    hasRequiredKeys(value.drivers, driverKeys) &&
    Array.isArray(value.assumptions) &&
    Array.isArray(value.decisionGates) &&
    Array.isArray(value.experiments) &&
    typeof value.coherenceReview === "string"
  );
}

function normalizeVentureForApi(venture: SimOneVenture): SimOneVenture {
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

function hasRequiredKeys(value: unknown, keys: string[]) {
  return isRecord(value) && keys.every((key) => isRecord(value[key]));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFilledString(value: unknown) {
  return typeof value === "string" && value.trim() !== "";
}
