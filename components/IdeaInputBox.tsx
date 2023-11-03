"use client";

import dynamic from "next/dynamic";
import {
    Avatar,
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Popover,
    Text,
    TextArea,
} from "@radix-ui/themes";
import React, { useRef, useState } from "react";
import { OutputData } from "@editorjs/editorjs";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import {
    CaretLeftIcon,
    CaretRightIcon,
    ChatBubbleIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { getSafeUserEmail } from "@/utils";
import { useSession } from "next-auth/react";
const Editor = dynamic(() => import("./Editor"), {
    ssr: false,
});
const Editor2 = dynamic(() => import("./Editor"), {
    ssr: false,
});

interface Props {
    idea: Idea;
    workspace: Workspace | undefined;
}

const IdeaInputBox = ({ idea, workspace }: Props) => {
    const editorRef = useRef(null);
    const consRef = useRef(null);
    const [created, setCreated] = useState(false);
    const [created2, setCreated2] = useState(false);
    const { data: session } = useSession();
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [isEditorActive, setIsEditorActive] = useState(true);

    const saveChanges = async (ref: any, cons: boolean = false) => {
        if (ref.current && workspace) {
            // @ts-ignore
            const outData: OutputData = await ref.current.save();

            const updatedIdeas = workspace.ideas?.map((item: Idea) => {
                if (item.id === idea.id) {
                    return cons
                        ? { ...item, cons: outData }
                        : { ...item, notes: outData };
                } else return { ...item };
            });

            await updateDoc(doc(db, "workspaces", workspace.id), {
                ideas: updatedIdeas,
            });
        }
    };

    const removeIdea = async () => {
        if (workspace && workspace.ideas) {
            const ideas = workspace.ideas.filter(
                (item, i) => item.id !== idea.id
            );
            await updateDoc(doc(db, "workspaces", workspace.id), {
                ideas,
            });
        }
    };

    const comment = async (val: string) => {
        const userEmail = getSafeUserEmail(session);
        const userName =
            session && session.user
                ? (session.user.name as string)
                : "Unknown coder";

        const comment: IdeaComment = {
            content: val,
            user: { email: userEmail, name: userName },
        };

        let updatedIdeas = workspace?.ideas;
        let updatedIdea = updatedIdeas?.find((i) => i.id === idea.id) as Idea;

        if (updatedIdea?.comments && updatedIdea.comments.length !== 0) {
            updatedIdea.comments.push(comment);
        } else {
            updatedIdea["comments"] = [comment];
        }

        setCommentsOpen(true);

        await updateDoc(doc(db, "workspaces", workspace?.id as string), {
            ideas: updatedIdeas,
        });
    };

    return (
        <Flex>
            <Box
                style={{
                    position: "absolute",
                    width: "500px",
                    maxHeight: "400px",
                    background: "#fff",
                    border: "2px solid #eaeefe",
                    top: "60%",
                    left: "60%",
                    padding: "28px",
                    borderRadius: "10px",
                    cursor: "text",
                    overflow: "scroll",
                    textAlign: "left",
                }}
            >
                <Flex justify="between" align="center">
                    <Heading style={{ fontSize: "1.4rem", fontWeight: "600" }}>
                        {idea.name}
                    </Heading>

                    <Flex gap="2">
                        <IconButton
                            size="2"
                            variant="surface"
                            style={{ cursor: "pointer" }}
                            color="red"
                            onClick={() => {
                                setIsEditorActive(
                                    isEditorActive ? false : true
                                );
                            }}
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98664 7.5 8.98664C7.2208 8.98664 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z"
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                        </IconButton>

                        <CommentBox
                            onClick={comment}
                            user={
                                session && session.user
                                    ? (session.user.name as string)[0]
                                    : "0"
                            }
                        />

                        <IconButton
                            size="2"
                            variant="surface"
                            style={{ cursor: "pointer" }}
                            color="red"
                            onClick={() => removeIdea()}
                        >
                            <TrashIcon />
                        </IconButton>
                    </Flex>
                </Flex>
                <hr />

                {isEditorActive ? (
                    <Editor
                        workspace={workspace}
                        editorRef={editorRef}
                        setUser={null}
                        setCreated={setCreated}
                        created={created}
                        saveChanges={() => saveChanges(editorRef)}
                        data={idea.notes}
                        title={null}
                    />
                ) : (
                    <Editor2
                        workspace={workspace}
                        editorRef={consRef}
                        setUser={null}
                        setCreated={setCreated2}
                        created={created2}
                        saveChanges={() => saveChanges(consRef, true)}
                        data={idea.cons}
                        title={`Disadvantages:`}
                    />
                )}

                {idea.comments && idea.comments.length !== 0 && (
                    <IconButton
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                        }}
                        variant="ghost"
                        onClick={() =>
                            setCommentsOpen(commentsOpen ? false : true)
                        }
                    >
                        {commentsOpen ? <CaretLeftIcon /> : <CaretRightIcon />}
                    </IconButton>
                )}
            </Box>

            {idea.comments && commentsOpen && (
                <Box
                    style={{
                        position: "absolute",
                        width: "500px",
                        maxHeight: "400px",
                        background: "#fff",
                        border: "2px solid #eaeefe",
                        top: "60%",
                        left: "720%",
                        padding: "28px",
                        borderRadius: "10px",
                        cursor: "text",
                        overflow: "scroll",
                        textAlign: "left",
                    }}
                >
                    <Heading style={{ fontSize: "1.4rem", fontWeight: "600" }}>
                        Comments
                    </Heading>
                    <hr />

                    {idea.comments.map((comment, i) => (
                        <Box
                            key={i}
                            style={{
                                marginTop: "14px",
                                background: "#f2f3f7",
                                borderRadius: "10px",
                                padding: "8px",
                            }}
                        >
                            <Flex mb="2">
                                <Avatar
                                    fallback={comment.user.name[0]}
                                    mr="3"
                                />
                                <Box>
                                    <Heading size="3" style={{ color: "" }}>
                                        {comment.user.name}
                                    </Heading>
                                    <Text size="2" style={{ opacity: 0.6 }}>
                                        {comment.user.email}
                                    </Text>
                                </Box>
                            </Flex>

                            <Text
                                size="3"
                                style={{
                                    padding: "6px",
                                    display: "inline-block",
                                }}
                            >
                                {comment.content}
                            </Text>
                        </Box>
                    ))}
                </Box>
            )}
        </Flex>
    );
};

const CommentBox = ({ onClick, user }: any) => {
    return (
        <Popover.Root>
            <Popover.Trigger>
                <IconButton
                    size="2"
                    variant="surface"
                    style={{ cursor: "pointer" }}
                >
                    <ChatBubbleIcon />
                </IconButton>
            </Popover.Trigger>

            <Popover.Content style={{ width: 360 }}>
                <Flex gap="3">
                    <Avatar size="2" fallback={user} radius="full" />
                    <Box grow="1">
                        <TextArea
                            placeholder="Write a comment…"
                            style={{ height: 80 }}
                            id="comment-box"
                        />
                        <Flex gap="3" mt="3" justify="end">
                            <Popover.Close>
                                <Button
                                    onClick={() =>
                                        onClick(
                                            (
                                                document.querySelector(
                                                    "#comment-box"
                                                ) as HTMLTextAreaElement
                                            ).value.trim()
                                        )
                                    }
                                    size="1"
                                >
                                    Comment
                                </Button>
                            </Popover.Close>
                        </Flex>
                    </Box>
                </Flex>
            </Popover.Content>
        </Popover.Root>
    );
};

export default IdeaInputBox;
