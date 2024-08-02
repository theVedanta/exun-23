import { Box, Button } from "@radix-ui/themes";
import Notes from "./Notes";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import MainPane from "./MainPane";

const LeftPane = ({ workspace }: { workspace: Workspace | undefined }) => {
    const [notesOpen, setNotesOpen] = useState(false);

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            height="100%"
            px="6"
            py="6"
            className="lg:w-[30%] xl:w-[25%] 2xl:w-[20%]"
            style={{
                borderRight: "2px solid black",
                overflow: "scroll",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {notesOpen ? (
                <Notes workspace={workspace} />
            ) : (
                <MainPane workspace={workspace} />
            )}

            <Button
                variant="surface"
                size="4"
                style={{
                    width: "100%",
                    justifyContent: "space-between",
                    cursor: "pointer",
                }}
                onClick={() => setNotesOpen(notesOpen ? false : true)}
            >
                {!notesOpen ? (
                    <>
                        Notes <ArrowRightIcon />
                    </>
                ) : (
                    <>
                        <ArrowLeftIcon /> Main Menu
                    </>
                )}
            </Button>
        </Box>
    );
};

export default LeftPane;
