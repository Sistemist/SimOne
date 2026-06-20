import { desc, eq } from "drizzle-orm";

import type { AgentRunDraft } from "@/lib/agent-runs";
import { getDb } from "@/lib/db/client";
import { agentRuns } from "@/lib/db/schema";
import {
  deserializeAgentRunRow,
  serializeAgentRunForDb,
  type AgentRunPersistenceRow,
} from "@/lib/db/agent-run-mappers";
import { getPersistentVenture } from "@/lib/db/ventures";

export { deserializeAgentRunRow, serializeAgentRunForDb };

export async function savePersistentAgentRun(ownerEmail: string, run: AgentRunDraft) {
  await assertOwnedVenture(ownerEmail, run.ventureId);

  const db = getDb();
  const row = serializeAgentRunForDb(run);

  await db
    .insert(agentRuns)
    .values(row)
    .onConflictDoUpdate({
      target: agentRuns.id,
      set: {
        engineOrDriver: row.engineOrDriver,
        task: row.task,
        status: row.status,
        modelProvider: row.modelProvider,
        retrievalSource: row.retrievalSource,
        humanApproval: row.humanApproval,
        trace: row.trace,
        updatedAt: new Date(),
      },
    });
}

export async function listPersistentAgentRuns(
  ownerEmail: string,
  ventureId: string,
): Promise<AgentRunDraft[]> {
  await assertOwnedVenture(ownerEmail, ventureId);

  const db = getDb();
  const rows = await db
    .select()
    .from(agentRuns)
    .where(eq(agentRuns.ventureId, ventureId))
    .orderBy(desc(agentRuns.updatedAt));

  return rows.map((row) => deserializeAgentRunRow(row as AgentRunPersistenceRow));
}

async function assertOwnedVenture(ownerEmail: string, ventureId: string) {
  const venture = await getPersistentVenture(ownerEmail, ventureId);
  if (!venture) {
    throw new Error("VENTURE_NOT_FOUND");
  }
}
