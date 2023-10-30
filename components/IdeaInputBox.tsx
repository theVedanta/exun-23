import { Box, Heading } from "@radix-ui/themes";
import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import List from "@editorjs/list";

const IdeaInputBox = ({ idea }: { idea: Idea }) => {
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
        <>
            <Box
                style={{
                    position: "absolute",
                    width: "400px",
                    maxHeight: "300px",
                    background: "#eee",
                    border: "1px solid #ccc",
                    top: "60%",
                    left: "60%",
                    padding: "28px",
                    borderRadius: "10px",
                    cursor: "text",
                    overflow: "scroll",
                }}
            >
                <Heading style={{ fontSize: "19px", fontWeight: "600" }}>
                    {idea.name}
                </Heading>
                <hr />

                <Box
                    style={{ paddingTop: "5px" }}
                    id="notes"
                    ref={boxRef}
                ></Box>
            </Box>
        </>
    );
};

export default IdeaInputBox;
