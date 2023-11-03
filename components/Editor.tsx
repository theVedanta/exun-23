import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./EditerTools";
import { Box, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { makeID, getSafeUserEmail } from "@/utils";

interface Props {
    data: any;
    editorRef: any;
    saveChanges: any;
    workspace: Workspace | undefined;
    created: boolean;
    setCreated: any;
    setUser: any | null | undefined;
    name: string;
}

export default function Editor({
    data,
    editorRef,
    saveChanges,
    workspace,
    created,
    setCreated,
    setUser,
    name,
}: Props) {
    const holderRef = useRef(null);
    const { data: session } = useSession();

    //initialize editorjs
    useEffect(() => {
        //initialize editor if we don't have a reference
        if (holderRef.current && workspace && !created) {
            if (setUser) {
                setUser(getSafeUserEmail(session));
            }

            editorRef.current = new EditorJS({
                holder: holderRef.current,
                tools: EDITOR_TOOLS,
                data,
                placeholder: "Start typing...",
                onChange(api, event) {
                    saveChanges();
                },
            });
            setCreated(true);
        }
    }, [holderRef, workspace]);

    return (
        <Box
            style={{
                paddingTop: "5px",
            }}
            id="notes"
            ref={holderRef}
        >
            {!workspace && (
                <Text style={{ color: "#666" }}>
                    Please create a workspace by writing an Agenda or signing in
                </Text>
            )}
        </Box>
    );
}
