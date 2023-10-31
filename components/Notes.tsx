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
	const [user, setUser] = useState<String | null>(null)
	
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

			<Editor editorRef={editorRef} name='note' saveChanges={saveChanges} setUser={setUser} workspace={workspace} setCreated={setCreated} created={created} data={workspace?.notes ? workspace?.notes?.find((n) => n.email === user)?.notes : undefined} />
		</Box>
	);
};

export default Notes;
