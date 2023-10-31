export async function POST(request: Request) {
    const { workspace } = await request.json();

    const response = await fetch(
        "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                // inputs: `We need to make a product on this topic (ignore any links in the following text): "${workspace.agenda}". Suggest 3 ideas.`,
                inputs: `Suggest 3 ideas for a blockchain app`,
            }),
        }
    );

    if (!response.ok) return console.log(await response.json());

    const result = await response.json();
    console.log(result);

    return Response.json({ data: "hello" });
}
