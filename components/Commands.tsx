import db from "@/app/db";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { doc, updateDoc } from "firebase/firestore";

const Commands = ({
    workspace,
    animationControls,
    setIsCustomizeToolActive,
    setReset
}:
{
    workspace: Workspace | undefined;
    animationControls: any;
    setIsCustomizeToolActive:any;
    setReset:any;
}) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="soft" size="4" disabled={!workspace}>
                    Commands
                    <CaretUpIcon />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                <DropdownMenu.Item
                    onClick={() => {
                        animationControls.set({
                            x:0,
                            y:0,
                          })
                          setReset(true)
                    }}
                    shortcut="⌘L"
                >
                    Organize Workspace
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={async () => {
                        if (workspace) {
                            await updateDoc(
                                doc(db, "workspaces", workspace.id),
                                {
                                    ideas: [],
                                }
                            );
                        }
                    }}
                    shortcut="⌘D"
                >
                    Delete all Ideas
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={() => setIsCustomizeToolActive((prev:boolean)=>!prev)}
                    shortcut="⌘D"
                >
                    Customize
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};
export default Commands;
