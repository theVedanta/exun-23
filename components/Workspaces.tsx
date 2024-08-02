"use client";

import db from "@/app/db";
import { createWorkspace, makeID } from "@/utils";
import { ArrowRightIcon, CaretDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";
import { Dialog, Text } from "@radix-ui/themes";
import { Button, DropdownMenu, Flex } from "@radix-ui/themes";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Workspaces = () => {
    const { data: session } = useSession();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

    useEffect(() => {
        const getData = async () => {
            let ws: Workspace[] = [];
            const fetchedWs = await getDocs(
                query(
                    collection(db, "workspaces"),
                    // @ts-ignore
                    where("owner", "==", session.user.email)
                )
            );
            
            fetchedWs.forEach((d) =>
                ws.push({ ...d.data(), id: d.id } as Workspace)
            );

            const fetchedWs2 = await getDocs(collection(db, "workspaces"));
            fetchedWs2.forEach(
                (w) =>
                    w.data().users &&
                    w
                        .data()
                        .users.find(
                            (usr: User) => usr.email === session?.user?.email
                        ) &&
                    !ws.find((wss) => wss.id === w.id) &&
                    ws.push({ ...w.data(), id: w.id } as Workspace)
            );

            setWorkspaces(ws);
        };

        session?.user && getData();
    }, [session?.user]);

    return (
        <Dialog.Root>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="soft" size="3">
                        Workspaces
                        <CaretDownIcon />
                    </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content
                    style={{
                        width: "14vw",
                    }}
                >
                    <Dialog.Trigger>
                        <DropdownMenu.Item>
                            Add new <PlusIcon />
                        </DropdownMenu.Item>
                    </Dialog.Trigger>

                    <DropdownMenu.Separator />

                    {workspaces.map((w, i) => (
                        <DropdownMenu.Item
                            onClick={() => {
                                localStorage.setItem("workspace", w.id);
                                window.location.reload();
                            }}
                            key={i}
                        >
                            {w.agenda.substring(0, 20)}
                            {w.agenda.length > 20 && "..."} <ArrowRightIcon />
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DialogBox
                session={session}
                setWorkspaces={setWorkspaces}
                workspaces={workspaces}
            />
        </Dialog.Root>
    );
};

const DialogBox = ({ session, setWorkspaces, workspaces }: any) => {
    return (
        <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Start Workspace</Dialog.Title>
            <Dialog.Description size="2" mb="4">
                Make a new space for your team
            </Dialog.Description>

            <Flex direction="column" gap="3">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Agenda
                    </Text>
                    <TextField.Input
                        id="agenda-input"
                        placeholder="Enter the agenda"
                    />
                </label>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                    <Button variant="soft" color="gray">
                        Cancel
                    </Button>
                </Dialog.Close>
                <Dialog.Close>
                    <Button
                        onClick={async () => {
                            const ag = (
                                document.querySelector(
                                    "#agenda-input"
                                ) as HTMLInputElement
                            ).value.trim();

                            const ws = await createWorkspace(
                                ag,
                                session && session.user && session.user.email
                                    ? session.user.email
                                    : localStorage.getItem("temporary-user")
                                    ? localStorage.getItem("temporary-user")
                                    : makeID()
                            );

                            setWorkspaces([...workspaces, ws]);
                            localStorage.setItem("workspace", ws.id);
                            window.location.reload();
                        }}
                    >
                        Create
                    </Button>
                </Dialog.Close>
            </Flex>
        </Dialog.Content>
    );
};

export default Workspaces;
