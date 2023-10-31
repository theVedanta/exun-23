"use client";

import { Box, Heading } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import CodeTool from "@editorjs/code";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";

interface Props {
	idea: Idea;
	workspace: Workspace | undefined;
}

const IdeaInputBox = ({ idea, workspace }: Props) => {
	const boxRef = useRef(null);
	const editorRef = useRef<EditorJS | null>(null);

	const saveChanges = async () => {
		if (editorRef.current && workspace) {
			const outData: OutputData = await editorRef.current.save();

			const updatedIdeas = workspace.ideas?.map((item: Idea) => {
				if (item.id === idea.id) {
					return { ...item, notes: outData };
				} else return { ...item };
			});

			await updateDoc(doc(db, "workspaces", workspace.id), {
				ideas: updatedIdeas,
			});
		}
	};

	useEffect(() => {
		if (boxRef.current) {
			editorRef.current = new EditorJS({
				holder: boxRef.current,
				tools: {
					header: Header,
					checklist: CheckList,
					list: List,
					code: CodeTool,
				},
				data: idea.notes,
				placeholder: "Write your heart out...",
				onChange: (api, event) => {
					saveChanges();
				},
			});
		}
	}, [boxRef]);

	return (
		<Box
			style={{
				position: "absolute",
				width: "400px",
				maxHeight: "300px",
				background: "#fff",
				border: "2px solid #eaeefe",
				top: "60%",
				left: "60%",
				padding: "28px",
				borderRadius: "10px",
				cursor: "text",
				overflow: "scroll",
				textAlign: "left",
				resize: "both",
			}}
		>
			<Heading style={{ fontSize: "19px", fontWeight: "600" }}>
				{idea.name}
			</Heading>
			<hr />

			<Box
				style={{
					paddingTop: "5px",
				}}
				id="notes"
				ref={boxRef}
			></Box>
		</Box>
	);
};

export default IdeaInputBox;
