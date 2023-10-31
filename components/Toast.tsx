import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { Cross2Icon } from "@radix-ui/react-icons";

const CustomToast = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
	return (
		<Toast.Provider swipeDirection="left">
			<Toast.Root
				className="ToastRoot"
				open={open}
				onOpenChange={setOpen}
			>
				<Toast.Title className="ToastTitle">
					Link has been copied!!
				</Toast.Title>

				<Toast.Action
					className="ToastAction"
					asChild
					altText="Goto schedule to undo"
				>
					<button className="Button small green">
						<Cross2Icon />
					</button>
				</Toast.Action>
			</Toast.Root>
			<Toast.Viewport className="ToastViewport" />
		</Toast.Provider>
	);
};

export default CustomToast;
