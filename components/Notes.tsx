"use client";

import dynamic from "next/dynamic";
import { OutputData } from "@editorjs/editorjs";
import { Box, Heading } from "@radix-ui/themes";
import { useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";

const Editor = dynamic(() => import("./Editor"), {
    ssr: false,
});

const Notes = ({ workspace }: { workspace: Workspace | undefined }) => {
    const editorRef = useRef(null);
    const [created, setCreated] = useState(false);
    const [user, setUser] = useState<String | null>(null);

    const saveChanges = async () => {
        if (editorRef.current && workspace) {
            // @ts-ignore
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

    return (
        <Box>
            <Heading>Notes</Heading>
            <hr />

            <Editor
                editorRef={editorRef}
                name="note"
                saveChanges={saveChanges}
                setUser={setUser}
                workspace={workspace}
                setCreated={setCreated}
                created={created}
                data={
                    workspace?.notes
                        ? workspace?.notes?.find((n) => n.email === user)?.notes
                        : undefined
                }
                isNotesEditor={true}
            />
        </Box>
    );
};

export default Notes;
