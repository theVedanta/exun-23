import { Flex } from "@radix-ui/themes";
import { ChangeEvent, ReactNode, RefObject, useEffect, useState } from "react";
import { motion } from "framer-motion";
import TextBox from "./TextBox";
import IdeaInputBox from "./IdeaInputBox";
import { useXarrow } from "react-xarrows";
import { useOthers, useUpdateMyPresence } from "@/liveblocks.config";
import Selection from "./Selection";
import { useDrop } from "react-dnd";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import { getSafeUserEmail } from "@/utils";
import { useSession } from "next-auth/react";

const COLORS = [
    "indigo",
    "crimson",
    "cyan",
    "orange",
    "blue",
    "amber",
    "bronze",
    "brown",
    "gold",
    "tomato",
];

interface Presence {
    cursor: { x: number; y: number } | null;
    selectedId: string | null;

    username: string | null;
    useremail: string | null;
}

function Selections({ id }: { id: string }) {
    const users = useOthers();

    return (
        <>
            {users.map(
                (
                    {
                        connectionId,
                        presence,
                    }: { connectionId: Number; presence: Presence },
                    i: Number
                ) => {
                    if (presence.selectedId === id) {
                        return (
                            <Selection
                                key={`${connectionId}`}
                                name={
                                    presence.username
                                        ? (presence.username as string)
                                        : `Unknown ${i}`
                                }
                                color={COLORS[Math.round(Math.random() * 10)]}
                            />
                        );
                    }
                }
            )}
        </>
    );
}

interface Props {
    title: string;
    constraintsRef: RefObject<Element>;
    children?: ReactNode;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => any;
    type: "textarea" | "notes";
    idea?: Idea | undefined;
    id: string;
    isAgenda?: Boolean;
    workspace: Workspace | undefined;
}

const Circle = ({
    title,
    children,
    constraintsRef,
    onChange,
    type,
    idea,
    id,
    isAgenda = false,
    workspace,
}: Props) => {
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);
    const updateXarrow = useXarrow();
    const updateMyPresence = useUpdateMyPresence();
    const { data: session } = useSession();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "card",
        drop: async (item: { user: User }) => {
            const user = getSafeUserEmail(session);

            if (type === "notes" && workspace && user === workspace.owner) {
                const wsRef = doc(db, "workspaces", workspace.id);

                if (!idea) return;

                let updatedIdeas = workspace.ideas as Idea[];
                let ideaToUpdate = workspace.ideas?.find(
                    (i) => i.id === idea.id
                ) as Idea;

                if (!ideaToUpdate?.users) {
                    ideaToUpdate["users"] = [
                        { email: item.user.email, name: item.user.name },
                    ];

                    return await updateDoc(wsRef, {
                        ideas: updatedIdeas,
                    });
                }

                // Check if user exists in this idea object
                if (
                    ideaToUpdate?.users.find(
                        (usr) => usr.email === item.user.email
                    )
                )
                    return;

                ideaToUpdate?.users.push({
                    email: item.user.email,
                    name: item.user.name,
                });

                await updateDoc(wsRef, {
                    ideas: updatedIdeas,
                });
            } else if (workspace && user !== workspace.owner) {
                alert("You are not the workspace owner");
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <motion.div
            style={{
                padding: "40px",
                paddingTop: "100px",
                zIndex: hover ? 10 : 5,
            }}
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onDrag={() => {
                updateXarrow();
                setHover(false);
            }}
            onDragEnd={() => {
                updateXarrow();
                setHover(true);
            }}
        >
            <Flex
                position="relative"
                justify="center"
                align="center"
                style={{
                    width: isAgenda ? "140px" : "80px",
                    height: isAgenda ? "140px" : "80px",
                    borderRadius: "50%",
                    transition: "all 0.3s",
                    background: "#eaeefe",
                    border: children ? "2px solid #6a80d9" : "",
                    fontSize: isAgenda ? "20px" : "13px",
                    textAlign: "center",
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => {
                    setHover(false);
                    setEditing(false);
                }}
                onClick={(e) => updateMyPresence({ selectedId: id })}
                // onBlur={() => updateMyPresence({ selectedId: null })}
                id={id}
                ref={drop}
            >
                {title.substring(0, 6)}
                {title.length > 6 && ".."}
                {hover &&
                    (type === "textarea" ? (
                        <TextBox
                            onChange={onChange}
                            setEditing={setEditing}
                            text={children ? children.toString() : ""}
                            editing={editing}
                        />
                    ) : (
                        <IdeaInputBox
                            idea={idea as Idea}
                            workspace={workspace}
                        />
                    ))}

                <Selections id={id} />
            </Flex>
        </motion.div>
    );
};
export default Circle;
