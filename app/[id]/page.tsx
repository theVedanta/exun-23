"use client";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
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
	}, [params.id]);

	// if (session && session.user) {
	// 	return <div></div>;
	// }

	return (
		<AlertDialog.Root open>
			<AlertDialog.Trigger>
				<Button>open</Button>
			</AlertDialog.Trigger>

			<AlertDialog.Content style={{ maxWidth: 450 }}>
				<AlertDialog.Title>Revoke access</AlertDialog.Title>
				<AlertDialog.Description size="2">
					Are you sure? This application will no longer be accessible
					and any existing sessions will be expired.
				</AlertDialog.Description>

				<Flex gap="3" mt="4" justify="end">
					<AlertDialog.Cancel>
						<Button variant="soft" color="gray">
							Cancel
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action>
						<Button variant="solid" color="red">
							Revoke access
						</Button>
					</AlertDialog.Action>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
}
