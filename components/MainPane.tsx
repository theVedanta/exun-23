import { BarChartIcon, TextIcon } from "@radix-ui/react-icons";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    Flex,
    Grid,
    Heading,
    Kbd,
    Tooltip,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";

const MainPane = ({ workspace }: { workspace: Workspace | undefined }) => {
    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [big, setBig] = useState(false);

    const summarise = async (workspace: Workspace) => {
        try {
            const res = await fetch("/api/summarise", {
                method: "POST",
                body: JSON.stringify({ workspace }),
            });

            const data = await res.json();
            return data.msg;
        } catch (err) {
            alert("Some error occurred");
        }
    };

    const suggest = async (workspace: Workspace) => {
        try {
            const res = await fetch("/api/suggest", {
                method: "POST",
                body: JSON.stringify({ workspace }),
            });

            const data = await res.json();
            return data.msg;
        } catch (err) {
            alert("Some error occurred");
        }
    };

    return (
        <>
            <Grid columns="2" gap="3" width="auto">
                <Tile
                    disabled={workspace || !loading ? false : true}
                    icon={<TextIcon />}
                    func={async () => {
                        setLoading(true);
                        let data = workspace ? await summarise(workspace) : "";

                        setLoading(false);
                        if (!data) return;

                        setTitle("Summary");
                        setAlertContent(data);
                        setOpenAlert(true);
                        setBig(false);
                    }}
                >
                    Summarise {loading && "coding"}
                </Tile>
                <Tile
                    disabled={workspace || !loading ? false : true}
                    icon={<BarChartIcon />}
                    func={async () => {
                        setLoading(true);
                        let data = workspace ? await suggest(workspace) : "";

                        setLoading(false);
                        if (!data) return;

                        setTitle("Suggestions");
                        setAlertContent(data);
                        setOpenAlert(true);
                        setBig(true);
                    }}
                >
                    Suggest
                </Tile>

                <CustomDialog
                    title={title}
                    open={openAlert}
                    setOpenAlert={setOpenAlert}
                    alertContent={alertContent}
                    big={big}
                />
            </Grid>

            {workspace && (
                <UserBlock
                    ideas={workspace.ideas ? workspace.ideas : []}
                    users={workspace.users}
                />
            )}
        </>
    );
};

const UserBlock = ({
    users = [],
    ideas,
}: {
    users: User[] | undefined;
    ideas: Idea[];
}) => {
    return (
        <Box
            p="4"
            style={{
                border: "2px solid #eaeefe",
                borderRadius: "10px",
                minHeight: "72%",
            }}
        >
            <Heading
                style={{
                    borderBottom: "2px solid #edf0fa",
                    paddingBottom: "10px",
                }}
                size="5"
            >
                Users
            </Heading>

            <Box
                style={{
                    overflow: "scroll",
                    height: "100%",
                }}
                mt="1"
            >
                {users.map((user) => (
                    <UserTile ideas={ideas} key={user.email} user={user} />
                ))}
            </Box>
        </Box>
    );
};

const UserTile = ({ user, ideas }: { user: User; ideas: Idea[] }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "card",
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: { user },
    }));
    const [inv, setInv] = useState(0);

    useEffect(() => {
        let ideasInvolvedIn = 0;
        for (let idea of ideas) {
            idea.users?.forEach((usr) => {
                if (usr.email === user.email) ideasInvolvedIn += 1;
            });
        }

        setInv(ideasInvolvedIn);
    }, [ideas, user.email]);

    return (
        <Flex
            style={{
                padding: "0.4rem",
                backgroundColor: "#f2f4fa",
                borderRadius: "10px",
                border: isDragging ? "2px solid red" : "1px solid #edf0fa",
                cursor: "grab",
                marginTop: "10px",
            }}
            key={user.email}
            align="center"
            justify="between"
            ref={drag}
        >
            <Flex align="center">
                <Avatar size="2" fallback={user.name.charAt(0)} mr="2" />
                {user.name}
            </Flex>

            <Tooltip content="Ideas involved in">
                <Kbd size="5">{inv}</Kbd>
            </Tooltip>
        </Flex>
    );
};

const Tile = ({ children, icon, func, disabled }: any) => {
    const [hover, setHover] = useState(false);

    return (
        <Button
            disabled={disabled}
            variant="soft"
            style={{
                borderRadius: "10px",
                height: "160px",
                padding: "20px",
                paddingTop: "20px",
                paddingBottom: "20px",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.1s",
                border:
                    hover && !disabled
                        ? "2px solid #6a80d9"
                        : "2px solid #eaeefe",
                color: disabled ? "#666" : "#6a80d9",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={func}
        >
            <Box
                p="2"
                style={{
                    background: "#c6d0f7",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                }}
            >
                {icon}
            </Box>
            <Heading size="3">{children}</Heading>
        </Button>
    );
};

const CustomDialog = ({
    open,
    alertContent,
    setOpenAlert,
    title,
    big,
}: {
    open: boolean;
    alertContent: string;
    setOpenAlert: any;
    title: string;
    big: boolean;
}) => {
    return (
        <Dialog.Root open={open}>
            <Dialog.Content style={{ maxWidth: big ? 650 : 450 }}>
                <Dialog.Title>{title}</Dialog.Title>
                {alertContent}
                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button
                            variant="soft"
                            color="gray"
                            onClick={() => setOpenAlert(false)}
                        >
                            Cancel
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default MainPane;
