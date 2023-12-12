import { Badge, Box, TextArea } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import linkifyHtml from "linkify-html";
import ReactHtmlParser from "react-html-parser";
const linkify = require("linkifyjs");

const TextBox = ({ editing, text, setEditing, onChange }: any) => {
    function extractDomainFromLink(linkText: string) {
        // Use a regular expression to match and extract the domain
        const domainRegex = /(?:https?:\/\/)?(?:www\.)?([^/]+)/;
        const match = linkText.match(domainRegex);

        if (match && match.length > 1) {
            return match[1]; // The extracted domain
        } else {
            return null; // No domain found in the link text
        }
    }

    const parsedText = text && ReactHtmlParser(linkifyHtml(text));
    const links = text ? linkify.find(text) : [];
    let timeout: NodeJS.Timeout;

    return editing ? (
        <TextArea
            size="3"
            placeholder="Describe this node..."
            style={{
                position: "absolute",
                width: "400px",
                minHeight: "300px",
                top: "60%",
                left: "60%",
                padding: "16px",
                borderRadius: "15px",
            }}
            onChange={(eve) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    onChange(eve);
                }, 1000);
            }}
            defaultValue={text && text}
        />
    ) : (
        <Box
            style={{
                position: "absolute",
                width: "400px",
                maxHeight: "300px",
                background: "#fff",
                border: "2px solid #eaeefe",
                top: "60%",
                left: "60%",
                padding: "28px",
                borderRadius: "10px",
                cursor: "text",
                fontSize: "1rem",
                textAlign: "left",
                overflow: "scroll",
                whiteSpace: "pre-line",
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
                        bottom: "28px",
                        width: "calc(100% - 64px)",
                        background: "#fff",
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
                            <Link
                                key={i}
                                target="_blank"
                                rel="noreferrer"
                                href={link.href}
                            >
                                <Badge
                                    style={{
                                        cursor: "pointer",
                                        marginRight: "10px",
                                    }}
                                    variant="surface"
                                >
                                    {extractDomainFromLink(link.value)}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </Box>
    );
};

export default TextBox;
