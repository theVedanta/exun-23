import { useOthers, useUpdateMyPresence } from "@/liveblocks.config";
import Cursor from "./Cursor";
import { useSession } from "next-auth/react";

export default function CursorPresence({ children }: { children: any }) {
	const updateMyPresence = useUpdateMyPresence();

	const onPointerMove = (event: any) => {
		updateMyPresence({
			cursor: {
				x: Math.round(event.clientX),
				y: Math.round(event.clientY),
			},
		});
	};

	const onPointerLeave = () => {
		updateMyPresence({ cursor: null });
	};

	const others = useOthers();
	const showOther = ({
		connectionId,
		presence,
	}: {
		connectionId: any;
		presence: any;
	}) => {
		if (!presence || !presence.cursor) {
			return null;
		}

		const { x, y } = presence.cursor;
		return <Cursor key={connectionId} x={x} y={y} />;
	};

	return (
		<div onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
			{others.map(showOther)}
			{children}
		</div>
	);
}
