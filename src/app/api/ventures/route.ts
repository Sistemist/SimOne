import { getCurrentAlphaUser } from "@/lib/auth";
import { listPersistentVentures, savePersistentVenture } from "@/lib/db/ventures";
import { normalizeVentureApiPayload } from "@/lib/venture-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentAlphaUser();
  if (!user) return Response.json({ message: "Sign in to sync ventures." }, { status: 401 });

  try {
    const ventures = await listPersistentVentures(user.email);
    return Response.json({ ventures });
  } catch (error) {
    return persistenceError(error);
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAlphaUser();
  if (!user) return Response.json({ message: "Sign in to sync ventures." }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "A venture payload is required." }, { status: 400 });
  }

  const result = normalizeVentureApiPayload(payload);
  if (!result.ok) {
    return Response.json({ message: result.message }, { status: result.status });
  }

  try {
    await savePersistentVenture(user.email, result.value);
    return Response.json({ venture: result.value });
  } catch (error) {
    return persistenceError(error);
  }
}

function persistenceError(error: unknown) {
  const message = error instanceof Error ? error.message : "Venture persistence failed.";
  const status = message.includes("DATABASE_URL") ? 503 : 500;

  return Response.json({ message }, { status });
}
