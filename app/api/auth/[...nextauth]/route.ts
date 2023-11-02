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
        async signIn({ user }) {
            try {
                console.log(user);
            } catch (err) {
                console.log(err);
            }

            // Kuch toh ha
            return true;
        },
    },
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
