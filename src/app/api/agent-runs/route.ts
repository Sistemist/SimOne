import { getCurrentAlphaUser } from "@/lib/auth";
import { listPersistentAgentRuns, savePersistentAgentRun } from "@/lib/db/agent-runs";
import { normalizeAgentRunApiPayload } from "@/lib/agent-runs";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getCurrentAlphaUser();
  if (!user) return Response.json({ message: "Sign in to sync agent runs." }, { status: 401 });

  const ventureId = new URL(request.url).searchParams.get("ventureId");
  if (!ventureId) {
    return Response.json({ message: "A venture id is required." }, { status: 400 });
  }

  try {
    const agentRuns = await listPersistentAgentRuns(user.email, ventureId);
    return Response.json({ agentRuns });
  } catch (error) {
    return persistenceError(error);
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAlphaUser();
  if (!user) return Response.json({ message: "Sign in to sync agent runs." }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "An agent run payload is required." }, { status: 400 });
  }

  const result = normalizeAgentRunApiPayload(payload);
  if (!result.ok) {
    return Response.json({ message: result.message }, { status: result.status });
  }

  try {
    await savePersistentAgentRun(user.email, result.value);
    return Response.json({ agentRun: result.value });
  } catch (error) {
    return persistenceError(error);
  }
}

function persistenceError(error: unknown) {
  const message = error instanceof Error ? error.message : "Agent run persistence failed.";
  if (message.includes("DATABASE_URL")) {
    return Response.json({ message }, { status: 503 });
  }

  if (message === "VENTURE_NOT_FOUND") {
    return Response.json({ message: "Venture not found for this account." }, { status: 404 });
  }

  return Response.json({ message }, { status: 500 });
}
