import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Provider from "@/components/Provider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Storm",
    description: "An app to help you brainstorm ideas",
    icons: "logo.png"
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            {/* <body className={inter.className}> */}
            <body>
                <Theme appearance="light">
                    <Provider>{children}</Provider>
                </Theme>
            </body>
        </html>
    );
}
