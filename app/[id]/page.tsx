"use client";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
    const { data: session } = useSession();

    useEffect(() => {
        if (localStorage.getItem("workspace") === params.id) {
            redirect("/");
        }
        if (session && session.user) {
            localStorage.setItem("workspace", params.id);
            redirect("/");
        }
    }, [params.id, session]);

    return (
        <AlertDialog.Root open>
            <AlertDialog.Content style={{ maxWidth: 450 }}>
                <AlertDialog.Title>Revoke access</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    You are not authenticated to access this workspace. <br />
                    Login and try again.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" onClick={() => signIn()}>
                            Login
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}
