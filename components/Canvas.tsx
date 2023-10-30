"use client";

import Circle from "./Circle";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AddIdea from "./AddIdea";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import db from "@/app/db";
import Auth from "./Auth";
import { Box, Flex } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

const createWorkspace = async (agenda: string, userEmail: string) => {
    const dbref = doc(collection(db, "workspaces"));
    localStorage.setItem("workspace", dbref.id);
    await setDoc(dbref, {
        agenda,
        userEmail,
    });
};

const Canvas = ({ workspace }: { workspace: Workspace | undefined }) => {
    const [userEmail, setUserEmail] = useState("");
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session && session.user) {
            setUserEmail(session.user.email);
        }
    }, []);
    const constraintsRef = useRef(null);

    const editAgenda = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!workspace) {
            createWorkspace(e.target.value.trim(), userEmail);
        }
    };

    return (
        <>
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
                    this i the main agenda code-warriors.org
                </Circle>

                <Flex
                    direction={"row"}
                    gap={"5"}
                    style={{ position: "fixed", bottom: "30px" }}
                >
                    <AddIdea workspace={workspace} />
                    <Auth />
                </Flex>
            </motion.div>
        </>
    );
};

export default Canvas;
