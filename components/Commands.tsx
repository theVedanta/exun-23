import { CaretUpIcon } from "@radix-ui/react-icons";
import { Button, DropdownMenu } from "@radix-ui/themes";
import axios from "axios";

const summarise = async (workspace: Workspace) => {
    const res = await axios.post(`/api/summarise`, { workspace });
    // const data = await res.json();
    console.log(res);
    return res.data.msg;
    
};

const suggest = async (workspace: Workspace) => {
    const res = await axios.post(`/api/suggest`, { workspace });
    console.log(res);
};

const Commands = ({ workspace,setOpenAlert, setAlertContent }: { workspace: Workspace | undefined, setOpenAlert?: any, setAlertContent?:any }) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="soft" size="4">
                    Commands
                    <CaretUpIcon />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                <DropdownMenu.Item
                    onClick={async () =>{
                        let data = '';
                        if (workspace) {

                            data= await summarise(workspace)
                        }
                        setOpenAlert(true)
                        setAlertContent(data)
                    }}
                    shortcut="⌘L"
                >
                    Summarise Workspace
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
