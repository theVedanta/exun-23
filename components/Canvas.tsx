import Circle from "./Circle";
import { useRef } from "react";
import { motion } from "framer-motion";
import { IconButton } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";

const Canvas = () => {
    const constraintsRef = useRef(null);

    return (
        <motion.div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            ref={constraintsRef}
        >
            <Circle constraintsRef={constraintsRef} title="Agenda">
                coding in github.com
            </Circle>

            <AddIdea />
        </motion.div>
    );
};

const AddIdea = () => {
    return (
        <IconButton
            style={{ position: "fixed", bottom: "30px", cursor: "pointer" }}
            size="4"
            variant="soft"
            color="gray"
            onClick={() => createIdea()}
        >
            <PlusIcon />
        </IconButton>
    );
};

export default Canvas;
