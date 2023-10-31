import { authorize } from "@liveblocks/node";

const secret = process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY as string;

export async function POST(req: Request, res: Response) {
    const data = await req.json();
    const room = data.room;
    const { body, status } = await authorize({ room, secret, userId: "123" });
    return new Response(body, {
        status,
    });
}
