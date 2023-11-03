import { IconButton } from "@radix-ui/themes";
import { AvatarIcon, ExitIcon } from "@radix-ui/react-icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import { useEffect } from "react";
import { useUpdateMyPresence } from "@/liveblocks.config";
import { randomColor } from "@/utils";

const Auth = () => {
    const { data: session } = useSession();
    const updateMyPresence = useUpdateMyPresence();

    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    useEffect(() => {
        const assignUser = async (email: string) => {
            const wsRef = doc(
                db,
                "workspaces",
                localStorage.getItem("workspace") as string
            );

            // CHECK IF WORKSPACE HAS USER ALREADY
            const wsSnap = await getDoc(wsRef);
            const ws = wsSnap.data() as Workspace;

            if (expression.test(ws.owner)) return;

            if (ws.owner === localStorage.getItem("temporary-user"))
                return await updateDoc(wsRef, {
                    owner: email,
                });
        };

        localStorage.getItem("workspace") &&
            session &&
            session.user &&
            session.user.email &&
            assignUser(session.user.email);

        session &&
            session.user &&
            updateMyPresence({
                username: session.user.name,
                useremail: session.user.email,
                usercolor: randomColor(),
            });
    }, [session]);

    if (session && session.user) {
        return (
            <IconButton
                style={{ cursor: "pointer" }}
                size="4"
                variant="soft"
                onClick={() => {
                    signOut();
                    localStorage.removeItem("workspace");
                }}
            >
                <ExitIcon />
            </IconButton>
        );
    }

    return (
        <>
            <IconButton
                style={{ cursor: "pointer" }}
                size="4"
                variant="soft"
                onClick={() => {
                    signIn();
                }}
            >
                <AvatarIcon />
            </IconButton>
        </>
    );
};

export default Auth;
