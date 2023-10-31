"use client";

import EditorJS, { OutputData } from "@editorjs/editorjs";
import { Box, Heading } from "@radix-ui/themes";
import Header from "@editorjs/header";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Table from "@editorjs/table";
// @ts-ignore
import CodeTool from "@editorjs/code";
import { useEffect, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import { useSession } from "next-auth/react";

const Notes = ({ workspace }: { workspace: Workspace | undefined }) => {
    const { data: session } = useSession();
    const boxRef = useRef(null);
    const editorRef = useRef<EditorJS | null>(null);
    console.log("WORKSPACE IN NOTE");
    console.log(workspace);

    const saveChanges = async () => {
        console.log("WORKSPACE is being printed");
        console.log(workspace); // pr0coder do this
        if (editorRef.current && workspace) {
            const outData: OutputData = await editorRef.current.save();
            console.log("in the if");

            let noteObj = workspace.notes?.find(
                (n) => n.email === session?.user?.email
            );
            const otherNotes = workspace.notes?.filter(
                (n) => n.email !== session?.user?.email
            );

            const updatedNotes = [
                ...(otherNotes as NoteObject[]),
                { ...noteObj, notes: outData },
            ];

            console.log("UPDATED NOTES:")
            console.log(updatedNotes);

            await updateDoc(doc(db, "workspaces", workspace.id), {
                notes: updatedNotes,
            });
        }
    };

    useEffect(() => {
        if (boxRef.current && workspace) {
            const noteObj = workspace?.notes?.find(
                (n) => n.email === session?.user?.email
            );

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
                    console.log("workspace on change");
                    console.log(workspace);
                    saveChanges();
                },
            });
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
