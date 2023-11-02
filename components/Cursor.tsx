import { Badge } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

// Simple arrow shape
const CursorImage = () => (
	<svg width="24" height="36">
		<path
			fill="currentColor"
			d="M8.482,0l8.482,20.36L8.322,17.412,0,20.36Z"
			transform="translate(11 22.57) rotate(-48)"
		/>
	</svg>
);

// Give cursor absolute x/y positioning
export default function Cursor({ x, y,name }: { x: number; y: number,name:String }) {
	const { data: session } = useSession();
	return (
		<div
			style={{
				transform: `translateX(${x}px) translateY(${y}px)`,
				zIndex: 99999,
			}}
		>
			<svg
				className="relative"
				width="24"
				height="36"
				viewBox="0 0 24 36"
				fill="none"
				stroke="white"
			>
				<path
					d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
					fill={"#6a80d9"}
				/>
			</svg>
			<div
				style={{
					borderRadius: 20,
					width: "max-content",
					marginTop: -30,
				}}
			>
				<Badge>
					{name ? name : "Unknown"}
				</Badge>
			</div>
		</div>
	);
}
