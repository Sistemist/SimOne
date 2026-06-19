import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "SimOne Alpha",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const name = String(credentials?.name || "SimOne Builder").trim();

        if (!email || !email.includes("@")) return null;

        return {
          id: email,
          email,
          name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/app/onboarding",
  },
});

export { handler as GET, handler as POST };
