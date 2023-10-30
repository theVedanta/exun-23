"use client";

import { Box } from "@radix-ui/themes";
import Canvas from "../components/Canvas";
import { doc, onSnapshot } from "firebase/firestore";
import db from "./db";
import { useEffect, useState } from "react";
import Workspaces from "@/components/Workspaces";


const Home = () => {
    const [workspace, setWorkspace] = useState<Workspace>();

    const getWorkspace = async (id: string | null) => {
        if (id) {
            onSnapshot(
                doc(db, "workspaces", id),
                (obj) =>
                    obj.exists() &&
                    setWorkspace({ ...obj.data(), id: obj.id } as Workspace)
            );
        }
    };

    useEffect(() => {
        const id = localStorage.getItem("workspace");
        getWorkspace(id);
    }, []);

    return (
        <Box
            style={{ paddingLeft: "20%", height: "100vh", overflow: "hidden" }}
        >
            <Workspaces />
            <Canvas workspace={workspace} setWorkspace={setWorkspace} /> 
        </Box>
    );
};

export default Home;
