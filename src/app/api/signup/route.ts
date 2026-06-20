import { NextResponse } from "next/server";

import { saveEarlyAccessLead } from "@/lib/db/leads";
import {
  SignupPayload,
  normalizeSignupPayload,
  parseWeb3FormsResponse,
  type NormalizedSignup,
} from "@/lib/signup";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: SignupPayload;

  try {
    payload = (await request.json()) as SignupPayload;
  } catch {
    return NextResponse.json({ message: "Invalid signup request." }, { status: 400 });
  }

  const normalized = normalizeSignupPayload(payload);

  if (!normalized.ok) {
    return NextResponse.json({ message: normalized.message }, { status: 400 });
  }

  const lead = normalized.value;
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { message: "Signup storage is not configured yet." },
      { status: 500 },
    );
  }

  let notificationStatus: "pending" | "sent" | "failed" = accessKey ? "pending" : "failed";

  try {
    if (accessKey) {
      notificationStatus = await notifyWeb3Forms(accessKey, lead);
    }

    await saveEarlyAccessLead(lead, notificationStatus);

    return NextResponse.json({ message: "Joined early access." });
  } catch {
    return NextResponse.json(
      { message: "Signup could not be saved. Please try again." },
      { status: 502 },
    );
  }
}

async function notifyWeb3Forms(
  accessKey: string,
  lead: NormalizedSignup,
): Promise<"sent" | "failed"> {
  try {
    const web3FormsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "SimOne Early Access Signup",
        from_name: "SimOne Site",
        email: lead.email,
        name: lead.name,
        use_case: lead.useCase,
        source: lead.source,
      }),
    });

    const text = await web3FormsResponse.text();
    const result = parseWeb3FormsResponse(text);

    return web3FormsResponse.ok && result.success ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
