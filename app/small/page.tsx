"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SmallPage = () => {
    const router = useRouter();

    useEffect(() => {
        const checkSize = () => {
            if (window.innerWidth > 1000) {
                router.push("/");
            }
        };
        checkSize();

        window.addEventListener("resize", checkSize);

        return () => {
            window.removeEventListener("resize", checkSize);
        };
    }, [router]);

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <LockIcon className="mx-auto h-16 w-16 text-primary" />
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Oops, this app is not available on small devices
                </h1>
                <p className="mt-4 text-muted-foreground">
                    We apologize for the inconvenience, but this application is
                    designed for larger screens and is not optimized for mobile
                    phones or tablets. Please try accessing this on a desktop or
                    laptop computer.
                </p>
            </div>
        </div>
    );
};

function LockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

export default SmallPage;
