import db from "@/app/db";
import { getSafeUserEmail } from "@/utils";
import {
    BarChartIcon,
    Cross1Icon,
    OpenInNewWindowIcon,
    TextIcon,
} from "@radix-ui/react-icons";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Dialog,
    Flex,
    Grid,
    Heading,
    HoverCard,
    IconButton,
    Kbd,
    Text,
    Tooltip,
} from "@radix-ui/themes";
import { doc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
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
            if (data.err) {
                alert("Some error occurred");
            }
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
            if (data.err) {
                alert("Some error occurred");
            }
            return data.msg;
        } catch (err) {
            alert("Some error occurred");
        }
    };

    return (
        <>
            <Grid
                columns="2"
                gap="3"
                width="auto"
                style={{
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? "none" : "all",
                }}
            >
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
                    Summarise
                </Tile>
                <Tile
                    disabled={workspace || !loading ? false : true}
                    icon={<BarChartIcon />}
                    func={async () => {
                        setLoading(true);
                        let data = workspace ? await suggest(workspace) : "";

                        setLoading(false);
                        if (!data) return alert("Some error occurred");

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
                    workspace={workspace}
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
    workspace,
}: {
    users: User[] | undefined;
    ideas: Idea[];
    workspace: Workspace;
}) => {
    const { data: session } = useSession();
    const user = getSafeUserEmail(session);

    let userIdeas: Idea[] = [];
    for (let idea of ideas) {
        if (idea.users) {
            if (idea.users.find((usr) => usr.email === user))
                userIdeas.push(idea);
        }
    }

    console.log(userIdeas);

    return (
        <Box
            p="4"
            style={{
                border: "2px solid #eaeefe",
                borderRadius: "10px",
                minHeight: "72%",
            }}
        >
            <Flex
                style={{
                    borderBottom: "2px solid #edf0fa",
                    paddingBottom: "8px",
                }}
                justify="between"
                width="100%"
            >
                <Heading size="5">Users</Heading>

                {workspace.owner !== getSafeUserEmail(session) && (
                    <Dialog.Root>
                        <Dialog.Trigger>
                            <IconButton variant="soft">
                                <OpenInNewWindowIcon />
                            </IconButton>
                        </Dialog.Trigger>

                        <Dialog.Content style={{ maxWidth: 600 }}>
                            <Dialog.Title>Users section</Dialog.Title>
                            <Dialog.Description size="2" mb="4">
                                Manage your idea statuses here and update
                                livetime!
                            </Dialog.Description>

                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                    <Button variant="soft" color="gray">
                                        Close
                                    </Button>
                                </Dialog.Close>
                            </Flex>
                        </Dialog.Content>
                    </Dialog.Root>
                )}
            </Flex>

            <Box
                style={{
                    overflow: "scroll",
                    height: "100%",
                }}
                mt="1"
            >
                {users.map((user) => (
                    <UserTile
                        workspace={workspace}
                        ideas={ideas}
                        key={user.email}
                        user={user}
                    />
                ))}
            </Box>
        </Box>
    );
};

const UserTile = ({
    user,
    ideas,
    workspace,
}: {
    user: User;
    ideas: Idea[];
    workspace: Workspace;
}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "card",
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: { user },
    }));

    const [inv, setInv] = useState<Idea[]>([]);

    useEffect(() => {
        let ideasInvolvedIn: Idea[] = [];
        for (let idea of ideas) {
            idea.users?.forEach((usr) => {
                if (usr.email === user.email) ideasInvolvedIn.push(idea);
            });
        }

        setInv(ideasInvolvedIn);
    }, [ideas, user.email]);

    return (
        <HoverCard.Root>
            <HoverCard.Trigger>
                <Flex
                    style={{
                        padding: "0.4rem",
                        backgroundColor: "#f2f4fa",
                        borderRadius: "10px",
                        border: isDragging
                            ? "2px solid red"
                            : "1px solid #edf0fa",
                        cursor: "grab",
                        marginTop: "10px",
                    }}
                    key={user.email}
                    align="center"
                    justify="between"
                    ref={drag}
                >
                    <Flex align="center">
                        <Avatar
                            size="2"
                            fallback={user.name.charAt(0)}
                            mr="2"
                        />
                        {user.name}
                    </Flex>

                    <Tooltip content="Ideas involved in">
                        <Kbd size="5">{inv.length}</Kbd>
                    </Tooltip>
                </Flex>
            </HoverCard.Trigger>

            {inv.length !== 0 && (
                <HoverCard.Content size="3" style={{ width: "300px" }}>
                    <Heading size="2">Ideas assigned to {user.name}:</Heading>
                    <hr />

                    {inv.map((d) => (
                        <Badge
                            style={{
                                marginTop: "6px",
                                padding: "6px 10px",
                            }}
                            key={d.id}
                        >
                            <Flex
                                align="center"
                                style={{ marginRight: "10px" }}
                            >
                                <Box
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        background: "red",
                                        marginRight: "10px",
                                    }}
                                ></Box>
                                <Text size="2">{d.name}</Text>
                            </Flex>

                            <IconButton
                                color="red"
                                size="1"
                                variant="ghost"
                                onClick={async () => {
                                    let ideasToUpdate = ideas;
                                    let ideaToUpdate = ideas.find(
                                        (ide) => ide.id === d.id
                                    ) as Idea;

                                    ideaToUpdate.users =
                                        ideaToUpdate.users?.filter(
                                            (usr) => usr.email !== user.email
                                        );

                                    await updateDoc(
                                        doc(
                                            db,
                                            "workspaces",
                                            workspace.id as string
                                        ),

                                        { ideas: ideasToUpdate }
                                    );
                                }}
                            >
                                <Cross1Icon />
                            </IconButton>
                        </Badge>
                    ))}
                </HoverCard.Content>
            )}
        </HoverCard.Root>
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
                height: "100%",
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

            <Heading style={{ marginTop: "60%" }} size="3">
                {children}
            </Heading>
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
                <hr />
                <br />
                <div style={{ whiteSpace: "pre-line" }}>
                    {alertContent.trim()}
                </div>

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
