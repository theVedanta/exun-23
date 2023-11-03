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
import { useState } from "react";
import axios from "axios";
import { DndProvider, useDrag } from "react-dnd";

const MainPane = ({ workspace }: { workspace: Workspace | undefined }) => {
    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const summarise = async (workspace: Workspace) => {
        const res = await axios.post(`/api/summarise`, { workspace });
        console.log(res.data.msg);

        return res.data.msg;
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

                        setTitle("Summary");
                        setAlertContent(data);
                        setOpenAlert(true);
                        setLoading(false);
                    }}
                >
                    Summarise
                </Tile>
                <Tile
                    disabled={workspace || !loading ? false : true}
                    icon={<BarChartIcon />}
                >
                    Suggest
                </Tile>

                <CustomDialog
                    title={title}
                    open={openAlert}
                    setOpenAlert={setOpenAlert}
                    alertContent={alertContent}
                />
            </Grid>

            {workspace && <UserBlock users={workspace.users} />}
        </>
    );
};

const UserBlock = ({ users = [] }: { users: User[] | undefined }) => {
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
                    <UserTile key={user.email} user={user} />
                ))}
            </Box>
        </Box>
    );
};

const UserTile = ({ user }: { user: User }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "card",
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        item: { user },
    }));

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

            {user.ideas && user.ideas.length !== 0 && (
                <Tooltip content="Ideas involved in">
                    <Kbd size="5">{user.ideas.length}</Kbd>
                </Tooltip>
            )}
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
}: {
    open: boolean;
    alertContent: string;
    setOpenAlert: any;
    title: string;
}) => {
    return (
        <Dialog.Root open={open}>
            <Dialog.Content style={{ maxWidth: 450 }}>
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
