
import db from "@/app/db";
import { doc, updateDoc } from "firebase/firestore";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: <string>process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: <string>process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
        try {
            console.log(user);
            console.log(account);
            console.log(profile);
            console.log(credentials);
            
                // 
        } catch (err) {
            console.log(err);
            
        }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };