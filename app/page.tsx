"use client";

import { Box, Flex, Heading } from "@radix-ui/themes";
import Canvas from "../components/Canvas";
import { doc, onSnapshot } from "firebase/firestore";
import db from "./db";
import { useEffect, useState } from "react";
import Workspaces from "@/components/Workspaces";
import Notes from "@/components/Notes";

const Home = () => {
    const [workspace, setWorkspace] = useState<Workspace>();

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
        <Box
            position="relative"
            style={{ paddingLeft: "20%", height: "100vh", overflow: "hidden" }}
        >
            <Notes workspace={workspace} />
            <Canvas workspace={workspace} setWorkspace={setWorkspace} />
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
                <Workspaces />
            </Flex>
        </Box>
    );
};

export default Home;
