import { earlyAccessLeads } from "@/lib/db/schema";
import { getDb } from "@/lib/db/client";
import type { NormalizedSignup } from "@/lib/signup";

export async function saveEarlyAccessLead(
  lead: NormalizedSignup,
  notificationStatus: "pending" | "sent" | "failed",
) {
  const db = getDb();

  await db.insert(earlyAccessLeads).values({
    email: lead.email,
    name: lead.name,
    useCase: lead.useCase,
    source: lead.source,
    notificationStatus,
  });
}
