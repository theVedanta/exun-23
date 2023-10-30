import { Flex } from "@radix-ui/themes";
import { ChangeEvent, ReactNode, RefObject, useState } from "react";
import { motion } from "framer-motion";
import TextBox from "./TextBox";

const Circle = ({
    title,
    children,
    constraintsRef,
    onChange,
    type,
}: {
    title: string;
    constraintsRef: RefObject<Element>;
    children?: ReactNode;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => any;
    type: "textarea" | "notes";
}) => {
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);

    return (
        <motion.div
            style={{ padding: "40px" }}
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
        >
            <Flex
                position="relative"
                justify="center"
                align="center"
                style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    transition: "all 0.3s",
                    background: "#eee",
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => {
                    setHover(false);
                    setEditing(false);
                }}
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
                        // ADD a NOTES Component here
                        <></>
                    ))}
            </Flex>
        </motion.div>
    );
};
export default Circle;
