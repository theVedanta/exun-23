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
import React, { useEffect, useRef, useState } from "react";
import { OutputData } from "@editorjs/editorjs";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import {
    ArrowRightIcon,
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

interface Props {
    idea: Idea;
    workspace: Workspace | undefined;
}

const IdeaInputBox = ({ idea, workspace }: Props) => {
    const editorRef = useRef(null);
    const [created, setCreated] = useState(false);
    const { data: session } = useSession();
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [isEditorActive, setIsEditorActive] = useState(true);

    const saveChanges = async () => {
        if (editorRef.current && workspace) {
            // @ts-ignore
            const outData: OutputData = await editorRef.current.save();

            const updatedIdeas = workspace.ideas?.map((item: Idea) => {
                if (item.id === idea.id) {
                    return { ...item, notes: outData };
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
        const userEmail = getSafeUserEmail(session, localStorage);
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

        if (updatedIdea?.comments && updatedIdea.comments.length!== 0) {
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

                    <Flex gap='2'>
                        <IconButton
                            size="2"
                            variant="surface"
                            style={{ cursor: "pointer" }}
                            color={isEditorActive ? "red" : 'blue'}
                            onClick={() => {
                                setIsEditorActive(isEditorActive ? false : true)
                            }}
                        >
                            {/* <TrashIcon /> */}
                            😔
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
                    {
                        isEditorActive ? 
                        <Editor
                            workspace={workspace}
                            name="idea"
                            editorRef={editorRef}
                            setUser={null}
                            setCreated={setCreated}
                            created={created}
                            saveChanges={saveChanges}
                            data={idea.notes}
                            isEditorActive={isEditorActive}
                        /> : 
                        <h1>Problems in {idea.name}</h1>
                    }

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
