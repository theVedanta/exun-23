"use client";

import Circle from "./Circle";
import { ChangeEvent, useRef } from "react";
import { motion } from "framer-motion";
import AddIdea from "./AddIdea";
import { addDoc, collection } from "firebase/firestore";
import db from "@/app/db";

const createWorkspace = async (agenda: string) => {
    await addDoc(collection(db, "workspaces"), {
        agenda,
    });
};

const Canvas = ({ workspace }: { workspace: Workspace | undefined }) => {
    const constraintsRef = useRef(null);

    const editAgenda = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!workspace) {
            createWorkspace(e.target.value.trim());
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
                this i the main agenda code-warriors.org
            </Circle>

            <AddIdea workspace={workspace} />
        </motion.div>
    );
};

export default Canvas;
