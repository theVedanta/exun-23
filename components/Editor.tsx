import React, { useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./EditerTools";
import { Box, Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { getSafeUserEmail } from "@/utils";
import { CheckIcon } from "@radix-ui/react-icons";

interface Props {
    data: any;
    editorRef: any;
    saveChanges: any;
    workspace: Workspace | undefined;
    created: boolean;
    setCreated: any;
    setUser: any | null | undefined;
    name?: string;
    title?: string | null;
    isEditorActive?: boolean;
    idea?: Idea;
}

export default function Editor({
    data,
    editorRef,
    saveChanges,
    workspace,
    created,
    setCreated,
    setUser,
    title = null,
    idea,
}: Props) {
    const holderRef = useRef(null);
    const { data: session } = useSession();
    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [heading, setHeading] = useState("");
    const [loading, setLoading] = useState(false);

    const resolve = async () => {
        try {
            const res = await fetch("/api/disadvantages", {
                method: "POST",
                body: JSON.stringify({ idea }),
            });

            const data = await res.json();
            if (data.err) {
                alert("Some error occurred");
            }
            return data.msg;
        } catch (err) {
            alert("Some error occurred");
        }
    };

    //initialize editorjs
    useEffect(() => {
        //initialize editor if we don't have a reference
        if (holderRef.current && workspace && !created) {
            console.log("hey");

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

            {title && (
                <Flex justify="between" align="center">
                    <Heading size="4" mt="3">
                        {title}
                    </Heading>

                    <Button
                        size="1"
                        disabled={loading ? true : false}
                        style={{ opacity: loading ? 0.8 : 1 }}
                        onClick={async () => {
                            setLoading(true);
                            let data = workspace ? await resolve() : "";

                            setLoading(false);
                            if (!data) return alert("Some error occurred");

                            setHeading("Ideas to fix the listed disadvantages");
                            setAlertContent(data);
                            setOpenAlert(true);
                        }}
                        variant="soft"
                    >
                        {loading ? "Dont leave box" : "Resolve"} <CheckIcon />
                    </Button>
                </Flex>
            )}

            <CustomDialog
                title={heading}
                open={openAlert}
                setOpenAlert={setOpenAlert}
                alertContent={alertContent}
            />
        </Box>
    );
}

const CustomDialog = ({
    open,
    alertContent,
    setOpenAlert,
    title,
}: {
    open: boolean;
    alertContent: string;
    setOpenAlert: any;
    title: string;
}) => {
    return (
        <Dialog.Root open={open}>
            <Dialog.Content style={{ maxWidth: 750 }}>
                <Dialog.Title>{title}</Dialog.Title>
                <hr />
                <br />
                <div style={{ whiteSpace: "pre-line" }}>
                    {alertContent.trim()}
                </div>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button
                            variant="soft"
                            color="gray"
                            onClick={() => setOpenAlert(false)}
                        >
                            Cancel
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
