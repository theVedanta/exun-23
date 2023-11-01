"use client";

import { Box, Flex, Heading, IconButton } from "@radix-ui/themes";
import Canvas from "../components/Canvas";
import { doc, onSnapshot } from "firebase/firestore";
import db from "./db";
import { useEffect, useState } from "react";
import Workspaces from "@/components/Workspaces";
import Notes from "@/components/Notes";
import { useSession } from "next-auth/react";
import { Share1Icon } from "@radix-ui/react-icons";
import { useClipboard } from "react-haiku";
import CursorPresence from "@/components/CursorPresence";
import { RoomProvider } from "@/liveblocks.config";
import CustomToast from "@/components/Toast";

const Home = () => {
    const clipboard = useClipboard({ timeout: 2000 });
    const [workspace, setWorkspace] = useState<Workspace>();
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    const getWorkspace = async () => {
        const id = localStorage.getItem("workspace");

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
        getWorkspace();
    }, []);

    return (
        <RoomProvider
            id={workspace ? workspace.id : "index-room"}
            initialPresence={{ cursor: null, selectedId: null, username:null, useremail:null }}
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
                    <Canvas getWorkspace={getWorkspace} workspace={workspace} />
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
                        {workspace && workspace.agenda?.length > 20 && "..."}
                    </Heading>
                    <Flex>
                        {session && session.user && <Workspaces />}
                        {workspace && workspace.id && (
                            <IconButton
                                size="3"
                                style={{ marginLeft: "20px" }}
                                variant="soft"
                                onClick={() => {
                                    clipboard.copy(
                                        `${process.env.NEXT_PUBLIC_BASE_LINK}/${workspace.id}`
                                    );
                                    setOpen(true);
                                }}
                            >
                                <Share1Icon />
                            </IconButton>
                        )}
                    </Flex>
                </Flex>

                <CustomToast open={open} setOpen={setOpen} />
            </Box>
        </RoomProvider>
    );
};

export default Home;
