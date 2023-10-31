"use client";

import EditorJS, { OutputData } from "@editorjs/editorjs";
import { Box, Heading } from "@radix-ui/themes";
import Header from "@editorjs/header";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import CodeTool from "@editorjs/code";
import { useEffect, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import { useSession } from "next-auth/react";
import { v4 } from "uuid";

const Notes = ({ workspace }: { workspace: Workspace | undefined }) => {
    const { data: session } = useSession();
    const boxRef = useRef(null);
    const editorRef = useRef<EditorJS | null>(null);
    const [created, setCreated] = useState(false);
    const makeID = () => {
        const newID = v4();
        localStorage.setItem("temporary-user", newID);

        return newID;
    };

    const user =
        session && session.user
            ? session?.user?.email
            : localStorage.getItem("temporary-user")
            ? localStorage.getItem("temporary-user")
            : makeID();

    const saveChanges = async () => {
        if (editorRef.current && workspace) {
            const outData: OutputData = await editorRef.current.save();

            // Searching a user with email
            const noteIndex = workspace?.notes?.findIndex(
                (note) => note.email === user
            );

            // Not found
            if (noteIndex === -1 || noteIndex === undefined) {
                await updateDoc(doc(db, "workspaces", workspace.id), {
                    notes: [
                        ...(workspace.notes ? workspace.notes : []),
                        { email: user, notes: outData },
                    ],
                });
            } else {
                // Found
                if (workspace.notes) {
                    const updatedNotes = workspace.notes
                        ? [...workspace?.notes]
                        : [];
                    updatedNotes[noteIndex] = {
                        email: user as string,
                        notes: outData,
                    };

                    await updateDoc(doc(db, "workspaces", workspace.id), {
                        notes: updatedNotes,
                    });
                }
            }
        }
    };

    useEffect(() => {
        if (boxRef.current && workspace && !created) {
            const noteObj = workspace?.notes?.find((n) => n.email === user);

            editorRef.current = new EditorJS({
                holder: boxRef.current,
                tools: {
                    header: Header,
                    checklist: CheckList,
                    list: List,
                    code: CodeTool,
                },
                placeholder: "Write your heart out...",
                data: workspace?.notes ? noteObj?.notes : undefined,
                onChange: (api, event) => {
                    saveChanges();
                },
            });

            setCreated(true);
        }
    }, [boxRef, workspace]);

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            height="100%"
            px="6"
            py="6"
            style={{
                width: "20%",
                borderRight: "2px solid black",
                overflowY: "scroll",
                zIndex: 10,
            }}
        >
            <Heading>Notes</Heading>
            <hr />

            <Box style={{ paddingTop: "10px" }} ref={boxRef}></Box>
        </Box>
    );
};

export default Notes;
