"use client";

import { Box } from "@radix-ui/themes";
import Notes from "../components/Notes";
import Canvas from "../components/Canvas";

const Home = () => {
    return (
        <Box
            style={{ paddingLeft: "20%", height: "100vh", overflow: "hidden" }}
        >
            <Notes />
            <Canvas />
        </Box>
    );
};

export default Home;
