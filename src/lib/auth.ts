import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find or create user (demo mode: any credentials work)
        let user = db.user.findByEmail(email);

        if (!user) {
          // Auto-create for demo — in production, use proper password hashing
          user = db.user.create({
            email,
            name: email.split("@")[0],
            password, // TODO: hash with bcrypt in production
            tier: "enterprise", // Demo default
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      // For Google OAuth sign-in, create/find the user in our in-memory store
      if (account?.provider === "google" && user?.email) {
        let dbUser = db.user.findByEmail(user.email);
        if (!dbUser) {
          dbUser = db.user.create({
            email: user.email,
            name: user.name || null,
            image: user.image || null,
            tier: "enterprise", // Demo default
          });
        }
        token.id = dbUser.id;
        token.tier = dbUser.tier;
      }
      // Fetch tier from DB on each token refresh
      if (token.id) {
        const dbUser = db.user.findById(token.id as string);
        if (dbUser) {
          token.tier = dbUser.tier;
          if (dbUser.name) token.name = dbUser.name;
          if (dbUser.image) token.picture = dbUser.image;
        }
      }
      // Handle session updates (e.g., after tier change)
      if (trigger === "update" && session) {
        if (session.tier) token.tier = session.tier;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as Record<string, unknown>).tier = token.tier as string;
      }
      return session;
    },
  },
});
