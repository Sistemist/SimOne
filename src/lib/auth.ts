import type { NextAuthOptions, User } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

type AlphaCredentials = Partial<Record<"email" | "name", unknown>> | undefined;
type CredentialsProviderFactory = typeof CredentialsProvider;

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV !== "production") {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}

const createCredentialsProvider = (
  (CredentialsProvider as unknown as { default?: CredentialsProviderFactory }).default ||
  CredentialsProvider
) as CredentialsProviderFactory;

export function normalizeAlphaCredentials(credentials: AlphaCredentials): User | null {
  const email = String(credentials?.email || "")
    .trim()
    .toLowerCase();
  const name = String(credentials?.name || "SimOne Builder").trim() || "SimOne Builder";

  if (!email || !email.includes("@")) return null;

  return {
    id: email,
    email,
    name,
  };
}

export function getSessionOwnerEmail(
  session: { user?: { email?: unknown } } | null | undefined,
): string | null {
  const email = String(session?.user?.email || "")
    .trim()
    .toLowerCase();

  return email && email.includes("@") ? email : null;
}

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "simone-alpha-development-secret-change-before-production",
  session: {
    strategy: "jwt",
  },
  providers: [
    createCredentialsProvider({
      name: "SimOne Alpha",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        return normalizeAlphaCredentials(credentials);
      },
    }),
  ],
  pages: {
    signIn: "/app/onboarding",
  },
};

export async function getCurrentAlphaUser() {
  const session = await getServerSession(authOptions);
  const email = getSessionOwnerEmail(session);

  if (!email) return null;

  return {
    email,
    name: session?.user?.name || "SimOne Builder",
  };
}
