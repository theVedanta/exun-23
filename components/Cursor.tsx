import { Badge } from "@radix-ui/themes";

export default function Cursor({
    x,
    y,
    name,
}: {
    x: number;
    y: number;
    name: String;
}) {
    return (
        <div
            style={{
                position: "fixed",
                transform: `translateX(${x}px) translateY(${y}px)`,
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
                <Badge>{name ? name : "Unknown"}</Badge>
            </div>
        </div>
    );
}
