import { Flex } from "@radix-ui/themes";
import { ChangeEvent, ReactNode, RefObject, useState } from "react";
import { motion } from "framer-motion";
import TextBox from "./TextBox";
import IdeaInputBox from "./IdeaInputBox";
import { useXarrow } from "react-xarrows";
import { useOthers, useSelf, useUpdateMyPresence } from "@/liveblocks.config";
import Selection from "./Selection";
import { useSession } from "next-auth/react";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

function Selections({ id }: { id: string }) {
	const users = useOthers();
	const { data: session } = useSession();

	return (
		<>
			{users.map(({ connectionId, presence }, i) => {
				if (presence.selectedId === id) {
					return (
						<Selection
							key={connectionId}
							name={
								session && session.user
									? session.user.name
									: `Unknown ${i}`
							}
							color={COLORS[i]}
						/>
					);
				}
			})}
		</>
	);
}

interface Props {
	title: string;
	constraintsRef: RefObject<Element>;
	children?: ReactNode;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => any;
	type: "textarea" | "notes";
	idea: Idea | undefined;
	id: string;
	isAgenda?: Boolean;
	workspace: Workspace | undefined;
}

const Circle = ({
	title,
	children,
	constraintsRef,
	onChange,
	type,
	idea,
	id,
	isAgenda = false,
	workspace,
}: Props) => {
	const [hover, setHover] = useState(false);
	const [editing, setEditing] = useState(false);
	const updateXarrow = useXarrow();

	const updateMyPresence = useUpdateMyPresence();

	return (
		<motion.div
			style={{ padding: "40px", zIndex: hover ? 12 : 5 }}
			drag
			dragConstraints={constraintsRef}
			dragMomentum={false}
			onDrag={() => {
				updateXarrow();
				setHover(false);
			}}
			onDragEnd={() => {
				updateXarrow();
				setHover(true);
			}}
		>
			<Flex
				position="relative"
				justify="center"
				align="center"
				style={{
					width: isAgenda ? "140px" : "80px",
					height: isAgenda ? "140px" : "80px",
					borderRadius: "50%",
					transition: "all 0.3s",
					background: "#eaeefe",
					border: children ? "2px solid #6a80d9" : "",
					fontSize: isAgenda ? "20px" : "13px",
					textAlign: "center",
				}}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => {
					setHover(false);
					setEditing(false);
				}}
				onClick={(e) => updateMyPresence({ selectedId: id })}
				// onBlur={() => updateMyPresence({ selectedId: null })}
				id={id}
			>
				{title.substring(0, 6)}
				{title.length > 6 && "..."}
				{hover &&
					(type === "textarea" ? (
						<TextBox
							onChange={onChange}
							setEditing={setEditing}
							text={children ? children.toString() : ""}
							editing={editing}
						/>
					) : (
						<IdeaInputBox
							idea={idea as Idea}
							workspace={workspace}
						/>
					))}

				<Selections id={id} />
			</Flex>
		</motion.div>
	);
};
export default Circle;
