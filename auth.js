import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getUser, retrieveUserRoles } from "@/app/lib/data";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async session({ token, session }) {
      const userID = token.id;
      session.user.id = userID;
      session.user.role = token.role;
      session.user.first_name = token.first_name;
      session.user.last_name = token.last_name;
      return session;
    },
    async jwt({ token }) {
      const userID = token.sub;
      const userRole = await retrieveUserRoles(userID);
      token.role = JSON.parse(userRole)[0].role;
      token.first_name = JSON.parse(userRole)[0].first_name;
      token.last_name = JSON.parse(userRole)[0].last_name;
      return token;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const hashedPassword = await bcrypt.compare(password, user.password);
          console.log(user);
          if (hashedPassword) {
            return user;
          } else {
            return null;
          }
        }
        return null;
      },
    }),
  ],
});
