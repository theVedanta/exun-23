import * as Toast from "@radix-ui/react-toast";
import { Cross2Icon } from "@radix-ui/react-icons";

const CustomToast = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
    return (
        <Toast.Provider swipeDirection="left">
            <Toast.Root open={open} onOpenChange={setOpen}>
                <Toast.Title>Link is copied</Toast.Title>
                <Toast.Description>
                    Share this link with your team to give them access
                </Toast.Description>
                <Toast.Action altText="Close toast">
                    <button className="Button small green">
                        <Cross2Icon />
                    </button>
                </Toast.Action>
            </Toast.Root>

            <Toast.Viewport />
        </Toast.Provider>
    );
};

export default CustomToast;
