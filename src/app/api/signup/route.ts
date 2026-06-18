import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupPayload = {
  email?: string;
  name?: string;
  useCase?: string;
  source?: string;
};

export async function POST(request: Request) {
  let payload: SignupPayload;

  try {
    payload = (await request.json()) as SignupPayload;
  } catch {
    return NextResponse.json({ message: "Invalid signup request." }, { status: 400 });
  }

  const email = String(payload.email || "").trim().toLowerCase();
  const name = String(payload.name || "").trim();
  const useCase = String(payload.useCase || "").trim();
  const source = String(payload.source || "simone-landing").trim();

  if (!emailPattern.test(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { message: "Signup service is not configured yet." },
      { status: 500 },
    );
  }

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
      email,
      name,
      use_case: useCase,
      source,
    }),
  });

  const result = (await web3FormsResponse.json()) as {
    success?: boolean;
    message?: string;
  };

  if (!web3FormsResponse.ok || !result.success) {
    return NextResponse.json(
      { message: result.message || "Signup service rejected the request." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "Joined early access." });
}
