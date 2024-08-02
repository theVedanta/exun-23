"use client";

import { Box, Flex, Heading, IconButton } from "@radix-ui/themes";
import Canvas from "../components/Canvas";
import { doc, onSnapshot } from "firebase/firestore";
import db from "./db";
import { useEffect, useState } from "react";
import Workspaces from "@/components/Workspaces";
import { useSession } from "next-auth/react";
import { CheckIcon, Share1Icon } from "@radix-ui/react-icons";
import { useClipboard } from "react-haiku";
import CursorPresence from "@/components/CursorPresence";
import { RoomProvider } from "@/liveblocks.config";
import LeftPane from "@/components/LeftPane";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useRouter } from "next/navigation";

const Home = () => {
    const clipboard = useClipboard({ timeout: 2000 });
    const [workspace, setWorkspace] = useState<Workspace>();
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const router = useRouter();

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

    useEffect(() => {
        const checkSize = () => {
            if (window.innerWidth < 1000) {
                router.push("/small");
            }
        };
        checkSize();

        window.addEventListener("resize", checkSize);

        return () => {
            window.removeEventListener("resize", checkSize);
        };
    }, [router]);

    return (
        <RoomProvider
            id={workspace ? workspace.id : "index-room"}
            initialPresence={{
                cursor: null,
                selectedId: null,
                username: null,
                useremail: null,
                usercolor: null,
            }}
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
                        <Canvas
                            getWorkspace={getWorkspace}
                            workspace={workspace}
                        />
                    </CursorPresence>

                    <Flex
                        justify="between"
                        align="center"
                        pt="6"
                        className="lg:left-[33%] xl:left-[28%] 2xl:left-[23%] lg:w-[65%] xl:w-[70%] 2xl:w-[75%]"
                        style={{
                            position: "fixed",
                            top: "0",
                        }}
                    >
                        <Heading>
                            {workspace?.agenda.substring(0, 40)}
                            {workspace &&
                                workspace.agenda?.length > 40 &&
                                "..."}
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

                                        setTimeout(() => setOpen(false), 1000);
                                    }}
                                >
                                    {open ? <CheckIcon /> : <Share1Icon />}
                                </IconButton>
                            )}
                        </Flex>
                    </Flex>
                </Box>
            </DndProvider>
        </RoomProvider>
    );
};

export default Home;
