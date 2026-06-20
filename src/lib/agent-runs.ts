import type { SprintZeroScope } from "./simone-model";

export type AgentRunStatus = "approval_required" | "approved" | "running" | "completed" | "blocked";
export type HumanApproval = "required" | "approved" | "rejected";

export type AgentRunDraft = {
  id: string;
  ventureId: string;
  scope: SprintZeroScope;
  task: string;
  status: AgentRunStatus;
  modelProvider: "openrouter";
  retrievalSource: "dify";
  humanApproval: HumanApproval;
  createdAt: string;
  updatedAt: string;
};

export function createAgentRunDraft(input: {
  ventureId: string;
  scope: SprintZeroScope;
  task: string;
}): AgentRunDraft {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    ventureId: input.ventureId,
    scope: input.scope,
    task: input.task.trim(),
    status: "approval_required",
    modelProvider: "openrouter",
    retrievalSource: "dify",
    humanApproval: "required",
    createdAt: now,
    updatedAt: now,
  };
}

export function canStartAgentRun(
  run: Pick<AgentRunDraft, "task" | "humanApproval">,
): { ok: true } | { ok: false; message: string } {
  if (!run.task.trim()) {
    return {
      ok: false,
      message: "Describe the bounded task before running an agent.",
    };
  }

  if (run.humanApproval !== "approved") {
    return {
      ok: false,
      message: "Human approval is required before this agent task can run.",
    };
  }

  return { ok: true };
}

type AgentRunApiPayloadResult =
  | { ok: true; value: AgentRunDraft }
  | { ok: false; status: 400 | 422; message: string };

const allowedScopes = new Set([
  "product",
  "customer",
  "cash",
  "skills",
  "innovation",
  "governance",
  "interaction",
  "culture",
]);

export function normalizeAgentRunApiPayload(payload: unknown): AgentRunApiPayloadResult {
  const rawPayload = isRecord(payload) && "agentRun" in payload ? payload.agentRun : payload;

  if (!isRecord(rawPayload)) {
    return {
      ok: false,
      status: 400,
      message: "An agent run payload is required.",
    };
  }

  if (!isCompleteAgentRun(rawPayload)) {
    return {
      ok: false,
      status: 422,
      message: "The agent run payload is incomplete.",
    };
  }

  return {
    ok: true,
    value: {
      ...rawPayload,
      task: String(rawPayload.task).trim(),
      modelProvider: "openrouter",
      retrievalSource: "dify",
    } as AgentRunDraft,
  };
}

export function loadAgentRuns(ventureId: string): AgentRunDraft[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(storageKey(ventureId));
  if (!raw) return [];

  try {
    const runs = JSON.parse(raw) as AgentRunDraft[];
    return runs.map(normalizeAgentRun);
  } catch {
    return [];
  }
}

export function saveAgentRuns(ventureId: string, runs: AgentRunDraft[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(ventureId), JSON.stringify(runs));
}

export function deleteAgentRuns(ventureId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(ventureId));
}

function normalizeAgentRun(run: AgentRunDraft): AgentRunDraft {
  return {
    ...run,
    status: run.status || "approval_required",
    modelProvider: "openrouter",
    retrievalSource: "dify",
    humanApproval: run.humanApproval || "required",
  };
}

function storageKey(ventureId: string) {
  return `simone.agentRuns.${ventureId}`;
}

function isCompleteAgentRun(value: Record<string, unknown>) {
  return (
    isFilledString(value.id) &&
    isFilledString(value.ventureId) &&
    typeof value.scope === "string" &&
    allowedScopes.has(value.scope) &&
    isFilledString(value.task) &&
    isFilledString(value.status) &&
    isFilledString(value.humanApproval) &&
    isFilledString(value.createdAt) &&
    isFilledString(value.updatedAt)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFilledString(value: unknown) {
  return typeof value === "string" && value.trim() !== "";
}
