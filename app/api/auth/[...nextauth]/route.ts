import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: <string>process.env.GOOGLE_CLIENT_ID,
            clientSecret: <string>process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
