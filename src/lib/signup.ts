const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupPayload = {
  email?: string;
  name?: string;
  useCase?: string;
  source?: string;
};

export type NormalizedSignup = {
  email: string;
  name: string;
  useCase: string;
  source: string;
};

export function normalizeSignupPayload(
  payload: SignupPayload,
): { ok: true; value: NormalizedSignup } | { ok: false; message: string } {
  const email = String(payload.email || "").trim().toLowerCase();
  const name = String(payload.name || "").trim();
  const useCase = String(payload.useCase || "").trim();
  const source = String(payload.source || "simone-landing").trim();

  if (!emailPattern.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  return {
    ok: true,
    value: {
      email,
      name,
      useCase,
      source: source || "simone-landing",
    },
  };
}

export function parseWeb3FormsResponse(text: string): { success?: boolean; message?: string } {
  if (!text) return {};

  try {
    return JSON.parse(text) as { success?: boolean; message?: string };
  } catch {
    return { success: false, message: text.slice(0, 180) };
  }
}
