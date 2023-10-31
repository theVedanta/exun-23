"use client";

import { Box, Flex, Heading, IconButton } from "@radix-ui/themes";
import Canvas from "../components/Canvas";
import { doc, onSnapshot } from "firebase/firestore";
import db from "./db";
import { useEffect, useState } from "react";
import Workspaces from "@/components/Workspaces";
import Notes from "@/components/Notes";
import { useSession } from "next-auth/react";
import { CopyIcon, Share1Icon } from "@radix-ui/react-icons";
import { useClipboard } from "react-haiku";
import CursorPresence from "@/components/CursorPresence";
import { RoomProvider } from "@/liveblocks.config";
import CustomToast from "@/components/Toast";

const Home = () => {
	const clipboard = useClipboard({ timeout: 2000 });
	const [workspace, setWorkspace] = useState<Workspace>();
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);

	const getWorkspace = async (id: string | null) => {
		if (id) {
			try {
				onSnapshot(doc(db, "workspaces", id), (obj) =>
					obj.exists()
						? setWorkspace({
								...obj.data(),
								id: obj.id,
						  } as Workspace)
						: localStorage.removeItem("workspace")
				);
			} catch (err) {
				console.log(err);
			}
		}
	};

	useEffect(() => {
		const id = localStorage.getItem("workspace");
		getWorkspace(id);
	}, []);

	return (
		<RoomProvider
			id={workspace ? workspace.id : "index-room"}
			initialPresence={{ cursor: null, selectedId: null }}
		>
			<Box
				position="relative"
				style={{
					paddingLeft: "20%",
					height: "100vh",
					overflow: "hidden",
				}}
			>
				<Notes workspace={workspace} />
				<CursorPresence>
					<Canvas workspace={workspace} setWorkspace={setWorkspace} />
				</CursorPresence>
				<Flex
					justify="between"
					align="center"
					style={{
						position: "fixed",
						top: "3%",
						left: "23%",
						width: "75%",
					}}
				>
					<Heading>
						{workspace?.agenda.substring(0, 20)}
						{workspace && workspace.agenda?.length > 30 && "..."}
					</Heading>
					<Flex>
						{session && session.user && <Workspaces />}
						<IconButton
							size="3"
							style={{ marginLeft: "20px" }}
							variant="soft"
							onClick={() => {
								clipboard.copy(
									`http://localhost:3000/${workspace?.id}`
								);
								setOpen(true);
							}}
						>
							<Share1Icon />
						</IconButton>
					</Flex>
				</Flex>
				<CustomToast open={open} setOpen={setOpen} />
			</Box>
		</RoomProvider>
	);
};

export default Home;