import type { AgentRunDraft } from "../agent-runs";
import type { SprintZeroScope } from "../simone-model";

export type AgentRunTrace = {
  events: Array<{
    type: string;
    status: string;
  }>;
};

export type AgentRunPersistenceRow = {
  id: string;
  ventureId: string;
  engineOrDriver: SprintZeroScope;
  task: string;
  status: AgentRunDraft["status"];
  modelProvider: AgentRunDraft["modelProvider"];
  retrievalSource: AgentRunDraft["retrievalSource"];
  humanApproval: AgentRunDraft["humanApproval"];
  trace: AgentRunTrace;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeAgentRunForDb(run: AgentRunDraft): AgentRunPersistenceRow {
  return {
    id: run.id,
    ventureId: run.ventureId,
    engineOrDriver: run.scope,
    task: run.task,
    status: run.status,
    modelProvider: "openrouter",
    retrievalSource: "dify",
    humanApproval: run.humanApproval,
    trace: {
      events: [
        {
          type: "approval",
          status: run.humanApproval,
        },
      ],
    },
    createdAt: new Date(run.createdAt),
    updatedAt: new Date(run.updatedAt),
  };
}

export function deserializeAgentRunRow(row: AgentRunPersistenceRow): AgentRunDraft {
  return {
    id: row.id,
    ventureId: row.ventureId,
    scope: row.engineOrDriver,
    task: row.task,
    status: row.status,
    modelProvider: "openrouter",
    retrievalSource: "dify",
    humanApproval: row.humanApproval,
    createdAt: (row.createdAt || new Date()).toISOString(),
    updatedAt: (row.updatedAt || new Date()).toISOString(),
  };
}
