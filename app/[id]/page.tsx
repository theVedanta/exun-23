"use client";

import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import db from "../db";

export default function Page({ params }: { params: { id: string } }) {
    const { data: session } = useSession();

    useEffect(() => {
        if (localStorage.getItem("workspace") === params.id) {
            redirect("/");
        }

        if (session && session.user) {
            const addUserIfNotPresent = async () => {
                const docRef = doc(db, "workspaces", params.id);
                const wsSnap = await getDoc(docRef);

                if (wsSnap.exists()) {
                    const workspace = wsSnap.data() as Workspace;
                    const userExists = workspace.users?.find(
                        (user) => user.email === session.user?.email
                    );

                    if (userExists == undefined) {
                        await updateDoc(docRef, {
                            users: [
                                ...(workspace.users ? workspace.users : []),
                                {
                                    name: session.user?.name,
                                    email: session.user?.email,
                                },
                            ],
                        });
                    }
                }
            };

            addUserIfNotPresent();

            localStorage.setItem("workspace", params.id);
            redirect("/");
        }
    }, [params.id, session]);

    return (
        (!session || !session.user) && (
            <AlertDialog.Root open>
                <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>Please Log in</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                        Please authenticate in order to access this account. The
                        workspace will be saved in &quot;Your Workspaces&quot;
                        <br />
                        Login and try again.
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Action>
                            <Button variant="solid" onClick={() => signIn()}>
                                Login
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        )
    );
}
