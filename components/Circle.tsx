import { Box, Flex, TextArea, Button } from "@radix-ui/themes";
import { ReactNode, RefObject, useRef, useState } from "react";
import { motion } from "framer-motion";
import linkifyHtml from "linkify-html";
import ReactHtmlParser from "react-html-parser";
const linkify = require("linkifyjs");

const Circle = ({
    title,
    children,
    constraintsRef,
    ...props
}: {
    title: string;
    constraintsRef: RefObject<Element>;
    children?: ReactNode;
}) => {
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);

    const parsedText =
        children && ReactHtmlParser(linkifyHtml(children.toString()));
    const links = linkify.find(children?.toString());

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
                {...props}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => {
                    setHover(false);
                    setEditing(false);
                }}
            >
                {title}
                {hover &&
                    (editing ? (
                        <TextArea
                            size="3"
                            placeholder="Describe this node..."
                            style={{
                                position: "absolute",
                                width: "400px",
                                minHeight: "200px",
                                top: "60%",
                                left: "60%",
                                padding: "16px",
                                borderRadius: "15px",
                            }}
                            defaultValue={children?.toString()}
                        />
                    ) : (
                        <Box
                            style={{
                                position: "absolute",
                                width: "400px",
                                minHeight: "200px",
                                background: "#ddd",
                                top: "60%",
                                left: "60%",
                                padding: "28px",
                                borderRadius: "15px",
                                cursor: "text",
                            }}
                            onClick={() => {
                                setEditing(true);
                            }}
                        >
                            {parsedText}

                            {links.length > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "22px",
                                        width: "calc(100% - 64px)",
                                    }}
                                >
                                    <hr />
                                    <div
                                        className="links"
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            overflowX: "scroll",
                                        }}
                                    >
                                        {links.map((link: any, i: number) => (
                                            <a
                                                key={i}
                                                target="_blank"
                                                rel="noreferrer"
                                                href={link.href}
                                            >
                                                <Button
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {link.value}
                                                </Button>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Box>
                    ))}
            </Flex>
        </motion.div>
    );
};
export default Circle;
