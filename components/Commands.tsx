import { CaretUpIcon } from "@radix-ui/react-icons";
import { Button, DropdownMenu } from "@radix-ui/themes";

const Commands = ({ workspace }: { workspace: Workspace | undefined }) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="soft" size="4">
                    Commands
                    <CaretUpIcon />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                <DropdownMenu.Item shortcut="⌘L">
                    Organize Workspace
                </DropdownMenu.Item>
                {/* <DropdownMenu.Item
                    onClick={() => workspace && suggest(workspace)}
                    shortcut="⌘D"
                >
                    Suggest themes
                </DropdownMenu.Item> */}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};
export default Commands;
