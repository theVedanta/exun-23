"use client";

import { Box, Flex, Heading, IconButton } from "@radix-ui/themes";
import Canvas from "../components/Canvas";
import { doc, onSnapshot } from "firebase/firestore";
import db from "./db";
import { useEffect, useRef, useState } from "react";
import Workspaces from "@/components/Workspaces";
import Notes from "@/components/Notes";
import { useSession } from "next-auth/react";
import { Share1Icon } from "@radix-ui/react-icons";
import { useClipboard } from "react-haiku";
import CursorPresence from "@/components/CursorPresence";
import { RoomProvider } from "@/liveblocks.config";
import CustomToast from "@/components/Toast";
import LeftPane from "@/components/LeftPane";
import {HTML5Backend} from 'react-dnd-html5-backend'
import{DndProvider} from 'react-dnd'

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
                <DndProvider backend={HTML5Backend}>

            <Box
                position="relative"
                style={{
                    paddingLeft: "20%",
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                <LeftPane workspace={workspace} />

                <CursorPresence>
                    <Canvas getWorkspace={getWorkspace} workspace={workspace} />
                </CursorPresence>
                <Flex
                    justify="between"
                    align="center"
                    pt="6"
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "23%",
                        width: "75%",
                    }}
                >
                    <Heading>
                        {workspace?.agenda.substring(0, 40)}
                        {workspace && workspace.agenda?.length > 40 && "..."}
                    </Heading>

                    <Flex>
                        {session && session.user && <Workspaces />}

                        {workspace && (
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
            </DndProvider>

        </RoomProvider>
    );
};

export default Home;
