import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const { email, password } = credentials;

        if (!email || !password) return null;

        const user = await User.findOne({ email }).lean();
        if (!user || !user.password) return null;

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          plan: user.plan,
          subscription: user.subscription,
          kitsGeneratedThisMonth: user.kitsGeneratedThisMonth || 0,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.plan = user.plan;
        token.subscription = user.subscription;
        token.kitsGeneratedThisMonth = user.kitsGeneratedThisMonth || 0;
      }
      
      // Handle manual updates to session (e.g., after kit generation or promo application)
      if (trigger === "update" && session) {
        if (session.kitsGeneratedThisMonth !== undefined) {
          token.kitsGeneratedThisMonth = session.kitsGeneratedThisMonth;
        }
        if (session.plan !== undefined) {
          token.plan = session.plan;
        }
        if (session.subscription !== undefined) {
          token.subscription = session.subscription;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.subscription = token.subscription;
        session.user.kitsGeneratedThisMonth = token.kitsGeneratedThisMonth;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
});
