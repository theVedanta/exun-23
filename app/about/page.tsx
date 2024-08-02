import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    LockOpen1Icon,
    DesktopIcon,
    BoxIcon,
    ReaderIcon,
    PersonIcon,
    BarChartIcon,
    OpenInNewWindowIcon,
    DashboardIcon,
} from "@radix-ui/react-icons";

interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
    img: string;
}

export default function About() {
    const feats: Feature[] = [
        {
            title: "Graphical at Heart",
            description:
                "Enjoy a design that emphasizes graphical elements and intuitive visuals for better user experience",
            icon: <BarChartIcon className="h-6 w-6 text-indigo-500" />,
            img: "/graph.gif",
        },
        {
            title: "Single Screen UI",
            description:
                "Experience all essential features conveniently available on a single, user-friendly interface",
            icon: <DesktopIcon className="h-6 w-6 text-indigo-500" />,
            img: "/single.png",
        },
        {
            title: "No Auth Required",
            description:
                "Jump in and start working. Access the application seamlessly without the need for any authentication or login process",
            icon: <LockOpen1Icon className="h-6 w-6 text-indigo-500" />,
            img: "/drag-n-drop.png",
        },
        {
            title: "AI Built-in",
            description:
                "Enhance productivity with AI-powered summaries and intelligent suggestions tailored to your needs",
            icon: <ReaderIcon className="h-6 w-6 text-indigo-500" />,
            img: "/ai.png",
        },
        {
            title: "Barebones UI",
            description:
                "Navigate through a simple and minimalistic user interface that ensures ease of use",
            icon: <DashboardIcon className="h-6 w-6 text-indigo-500" />,
            img: "/toolbar.png",
        },
        {
            title: "Live Collaboration",
            description:
                "Boost team efficiency with real-time collaboration and management features built into the app",
            icon: <PersonIcon className="h-6 w-6 text-indigo-500" />,
            img: "/cursor.gif",
        },
    ];

    return (
        <div className="flex flex-col px-6 sm:px-32">
            <header className="flex h-20 w-full shrink-0 items-center">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={200}
                        height={200}
                        className="h-24 sm:h-20 w-auto object-contain"
                    />
                </Link>

                <div className="flex w-full justify-center"></div>

                <Button className="bg-indigo-500">
                    Get Started &nbsp;&nbsp; <OpenInNewWindowIcon />
                </Button>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="grid items-center gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl">
                                    Unleash your brainstorming capabilities with
                                    Storm
                                    <span className="text-indigo-500">.</span>
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Capture your ideas, organize your thoughts,
                                    and turn them into action with our powerful
                                    note-taking and brainstorming features.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link href="/" prefetch={false}>
                                    <Button className="bg-indigo-500">
                                        Open Storm &nbsp;&nbsp;{" "}
                                        <OpenInNewWindowIcon />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Image
                            src="/hero-lap.png"
                            alt="Brainstorming"
                            width={600}
                            height={600}
                            className="w-full rounded-lg h-auto object-cover"
                        />
                    </div>
                </section>

                <section className="w-full py-16 md:py-24 lg:py-32">
                    <h1 className="text-4xl font-bold text-center mb-8 sm:mb-16 tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl">
                        Features
                        <span className="text-indigo-500">.</span>
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {feats.map((feat, i) => (
                            <div
                                className="grid gap-4 p-6 rounded-xl border shadow"
                                key={i}
                            >
                                <Image
                                    src={feat.img}
                                    alt="Brainstorming"
                                    width={600}
                                    height={337}
                                    className="w-full rounded-lg aspect-video object-cover"
                                />
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                        {feat.icon}
                                        <h3 className="text-lg sm:text-xl font-bold">
                                            {feat.title}
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        {feat.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <hr />

            <footer className="w-full py-4 flex items-center">
                &copy; 2024 | Storm
            </footer>
        </div>
    );
}
