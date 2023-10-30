import { Flex } from "@radix-ui/themes";
import { ChangeEvent, ReactNode, RefObject, useRef, useState } from "react";
import { motion } from "framer-motion";
import TextBox from "./TextBox";
import IdeaInputBox from "./IdeaInputBox";
import { useXarrow } from "react-xarrows";

interface Props {
    title: string;
    constraintsRef: RefObject<Element>;
    children?: ReactNode;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => any;
    type: "textarea" | "notes";
    idea: Ideas | undefined;
    id: string;
    ref?: any;
    isAgenda?: Boolean;
}

const Circle = ({
    title,
    children,
    constraintsRef,
    onChange,
    type,
    idea,
    id,
    ref,
    isAgenda = false,
}: Props) => {
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);
    const updateXarrow = useXarrow();

    return (
        <>
            <motion.div
                style={{ padding: "40px" }}
                drag
                dragConstraints={constraintsRef}
                dragMomentum={false}
                onDrag={updateXarrow}
                onDragEnd={updateXarrow}
            >
                <Flex
                    position="relative"
                    justify="center"
                    align="center"
                    style={{
                        width: isAgenda ? "120px" : "80px",
                        height: isAgenda ? "120px" : "80px",
                        borderRadius: "50%",
                        transition: "all 0.3s",
                        background: "#eee",
                        border: children ? "2px solid #0275d8" : "",
                        fontSize: isAgenda ? "20px" : "13px",
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => {
                        setHover(false);
                        setEditing(false);
                    }}
                    id={id}
                    ref={ref}
                >
                    {title}
                    {hover &&
                        (type === "textarea" ? (
                            <TextBox
                                onChange={onChange}
                                setEditing={setEditing}
                                text={children ? children.toString() : ""}
                                editing={editing}
                            />
                        ) : (
                            <IdeaInputBox idea={idea} />
                        ))}
                </Flex>
            </motion.div>
        </>
    );
};
export default Circle;
