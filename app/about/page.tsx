import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function About() {
    return (
        <div className="flex flex-col">
            <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
                <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
                    <MenuIcon className="fixed top-4 left-4 z-50 h-8 w-8 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <div className="flex w-full justify-center">
                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="#"
                                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                    prefetch={false}
                                >
                                    Features
                                </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="#"
                                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                    prefetch={false}
                                >
                                    Pricing
                                </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="#"
                                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                    prefetch={false}
                                >
                                    About
                                </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="#"
                                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                    prefetch={false}
                                >
                                    Contact
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="ml-auto w-[150px]">
                    <Button>Get Started</Button>
                </div>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid items-center gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl">
                                        Unleash Your Creativity with Our
                                        Brainstorming App
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                        Capture your ideas, organize your
                                        thoughts, and turn them into action with
                                        our powerful note-taking and
                                        brainstorming features.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link
                                        href="#"
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        prefetch={false}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                            <img
                                src="/placeholder.svg"
                                width="600"
                                height="400"
                                alt="Hero"
                                className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                            />
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="grid gap-4">
                                <img
                                    src="/placeholder.svg"
                                    width="128"
                                    height="128"
                                    alt="Brainstorming"
                                    className="w-full aspect-square rounded-lg bg-muted object-cover"
                                />
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                        <LightbulbIcon className="h-6 w-6 text-blue-500" />
                                        <h3 className="text-xl font-bold">
                                            Brainstorming Made Easy
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Unleash your creativity with our
                                        intuitive brainstorming tools. Capture
                                        ideas, organize thoughts, and turn them
                                        into actionable plans.
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <img
                                    src="/placeholder.svg"
                                    width="96"
                                    height="96"
                                    alt="Note-Taking"
                                    className="w-full aspect-square rounded-lg bg-muted object-cover"
                                />
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                        <StickyNoteIcon className="h-6 w-6 text-blue-500" />
                                        <h3 className="text-xl font-bold">
                                            Powerful Note-Taking
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Take rich, formatted notes with ease.
                                        Organize your thoughts and access them
                                        from anywhere, on any device.
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <img
                                    src="/placeholder.svg"
                                    width="96"
                                    height="96"
                                    alt="Collaboration"
                                    className="w-full aspect-square rounded-lg bg-muted object-cover"
                                />
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                        <UsersIcon className="h-6 w-6 text-blue-500" />
                                        <h3 className="text-xl font-bold">
                                            Seamless Collaboration
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Invite team members to collaborate on
                                        ideas, share notes, and stay in sync.
                                        Streamline your workflow and boost
                                        productivity.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function LightbulbIcon(props: any) {
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
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
        </svg>
    );
}

function MenuIcon(props: any) {
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
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}

function StickyNoteIcon(props: any) {
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
            <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
            <path d="M15 3v4a2 2 0 0 0 2 2h4" />
        </svg>
    );
}

function UsersIcon(props: any) {
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function XIcon(props: any) {
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
