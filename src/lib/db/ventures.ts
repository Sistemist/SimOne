import { and, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { ventures } from "@/lib/db/schema";
import {
  deserializeVentureRow,
  serializeVentureForDb,
  type VenturePersistenceRow,
} from "@/lib/db/venture-mappers";
import type { SimOneVenture } from "@/lib/simone-model";

export { deserializeVentureRow, serializeVentureForDb };

export async function savePersistentVenture(ownerEmail: string, venture: SimOneVenture) {
  const db = getDb();
  const row = serializeVentureForDb(ownerEmail, venture);

  await db
    .insert(ventures)
    .values(row)
    .onConflictDoUpdate({
      target: ventures.id,
      set: {
        ownerEmail: row.ownerEmail,
        name: row.name,
        idea: row.idea,
        audience: row.audience,
        intent: row.intent,
        engines: row.engines,
        drivers: row.drivers,
        assumptions: row.assumptions,
        decisionGates: row.decisionGates,
        experiments: row.experiments,
        coherenceReview: row.coherenceReview,
        updatedAt: new Date(),
      },
    });
}

export async function listPersistentVentures(ownerEmail: string): Promise<SimOneVenture[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(ventures)
    .where(eq(ventures.ownerEmail, ownerEmail.trim().toLowerCase()))
    .orderBy(desc(ventures.updatedAt));

  return rows.map((row) => deserializeVentureRow(row as VenturePersistenceRow));
}

export async function getPersistentVenture(
  ownerEmail: string,
  ventureId: string,
): Promise<SimOneVenture | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(ventures)
    .where(
      and(
        eq(ventures.ownerEmail, ownerEmail.trim().toLowerCase()),
        eq(ventures.id, ventureId),
      ),
    )
    .limit(1);

  return rows[0] ? deserializeVentureRow(rows[0] as VenturePersistenceRow) : null;
}
