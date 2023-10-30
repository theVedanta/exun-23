import { IconButton } from "@radix-ui/themes";
import { AvatarIcon, ExitIcon } from "@radix-ui/react-icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import { useEffect } from "react";

const Auth = () => {
    const { data: session } = useSession();

    const assignUser = async (email: string) => {
        const dbref = doc(
            db,
            "workspaces",
            localStorage.getItem("workspace") as string
        );
        await updateDoc(dbref, {
            user: email,
        });
    };

    useEffect(() => {
        localStorage.getItem("workspace") &&
            session &&
            session.user &&
            session.user.email &&
            assignUser(session.user.email);
    }, [session]);

    if (session && session.user) {
        return (
            <IconButton
                style={{ margin: "5px", cursor: "pointer" }}
                size="4"
                variant="soft"
                color="gray"
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
                style={{ margin: "5px", cursor: "pointer" }}
                size="4"
                variant="soft"
                color="gray"
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
