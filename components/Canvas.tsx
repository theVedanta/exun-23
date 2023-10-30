"use client";

import Circle from "./Circle";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AddIdea from "./AddIdea";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import Auth from "./Auth";
import { Flex } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import createWorkspace from "@/utils";

const Canvas = ({
    workspace,
    setWorkspace,
}: {
    workspace: Workspace | undefined;
    setWorkspace: any;
}) => {
    const [user, setUser] = useState<User>();
    const constraintsRef = useRef(null);
    const { data: session } = useSession();

    useEffect(() => {
        session && session.user && setUser(session.user as User);
    }, [session]);

    const editAgenda = async (e: ChangeEvent<HTMLTextAreaElement>) => {
        const agenda = e.target.value.trim();

        if (workspace === undefined) {
            const ws = await createWorkspace(agenda, user && user.email);
            setWorkspace(ws);
        } else {
            console.log(workspace);
            await updateDoc(doc(db, "workspaces", workspace.id), {
                agenda,
            });
        }
    };

    return (
        <motion.div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            ref={constraintsRef}
        >
            <Circle
                constraintsRef={constraintsRef}
                title="Agenda"
                onChange={(e) => editAgenda(e)}
                type="textarea"
            >
                {workspace && workspace.agenda}
            </Circle>

            <Flex
                gap="3"
                direction="row"
                style={{ position: "fixed", bottom: "30px" }}
            >
                <AddIdea workspace={workspace} />
                <Auth />
            </Flex>
        </motion.div>
    );
};

export default Canvas;
