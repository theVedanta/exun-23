import { Flex, IconButton } from "@radix-ui/themes";
import { ChangeEvent, ReactNode, RefObject, useState } from "react";
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
import { CircleIcon, SquareIcon } from "@radix-ui/react-icons";

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
                                color="indigo"
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
    dragControls: any;
    animationControls: any;
    isCustomizeToolActive: boolean;
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
    dragControls,
    animationControls,
    isCustomizeToolActive,
}: Props) => {
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);
    const updateXarrow = useXarrow();
    const updateMyPresence = useUpdateMyPresence();
    const { data: session } = useSession();
    const [radius, setRadius] = useState("50%");
    const [color, setColor] = useState("#eaeefe");

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
            dragControls={dragControls}
            animate={animationControls}
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
                    borderRadius: radius,
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
                id={id}
                ref={drop}
            >
                {isCustomizeToolActive && (
                    <Flex
                        style={{
                            position: "absolute",
                            top: "-35px",
                            left: "-20%",
                            background: "white",
                            boxShadow: "1px 2px 5px rgba(0,0,0,0.2)",
                            padding: "5px",
                            borderRadius: "8px",
                        }}
                        gap="1"
                    >
                        <IconButton
                            size="2"
                            variant="surface"
                            style={{ cursor: "pointer" }}
                            onClick={() => setRadius("10px")}
                            color="gold"
                        >
                            <SquareIcon />
                        </IconButton>
                        <IconButton
                            size="2"
                            variant="surface"
                            style={{ cursor: "pointer" }}
                            color="gold"
                            onClick={() => setRadius("50%")}
                        >
                            <CircleIcon />
                        </IconButton>
                    </Flex>
                )}

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
