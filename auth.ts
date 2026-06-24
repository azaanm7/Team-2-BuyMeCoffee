import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Keep the JWT (and therefore the session cookie) small. Only short remote URLs
// belong in the token — never base64 data URIs, which bloat the cookie past the
// header size limit and cause HTTP 431 errors.
function safeImage(image?: string | null): string | null {
  if (!image) return null;
  if (image.startsWith("data:")) return null;
  if (image.length > 512) return null;
  return image;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const { prisma } = await import("@/lib/prisma");
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { profile: true },
        });

        if (!user) {
          console.log("No user found for email:", credentials.email);
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        console.log("Password valid:", isValid);

        if (!isValid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.profile?.name || user.username,
          image: user.profile?.avatarImage || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.name = user.name;
        token.image = safeImage(user.image);
      }

      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        if (session.image !== undefined) {
          token.image = safeImage(session.image);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
});
