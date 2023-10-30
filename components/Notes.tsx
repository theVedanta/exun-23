"use client";

import EditorJS from "@editorjs/editorjs";
import { Box, Heading, ScrollArea } from "@radix-ui/themes";
import Header from "@editorjs/header";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import List from "@editorjs/list";
import { useEffect, useRef } from "react";

const Notes = () => {
    const boxRef = useRef(null);

    useEffect(() => {
        if (boxRef.current) {
            new EditorJS({
                holder: boxRef.current,
                tools: {
                    header: Header,
                    checklist: CheckList,
                    list: List,
                },
                placeholder: "Write your heart out...",
            });
        }
    }, []);

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

            <Box style={{ paddingTop: "10px" }} id="notes" ref={boxRef}></Box>
        </Box>
    );
};

export default Notes;
