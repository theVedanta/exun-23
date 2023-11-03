export async function POST(request: Request) {
    const { workspace } = await request.json();

    console.log("processing...");

    let token = process.env.NEXT_PUBLIC_HUGGING_FACE;

    let prompt = `Suggest 3 ideas for the topic: '${workspace.agenda}.'`;
    let genText = ``;

    const requestAPI = async () => {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: prompt + genText,
                    parameters: {
                        return_full_text: false,
                    },
                }),
            }
        );

        if (response.ok) return await response.json();
        else if (!response.ok) {
            if (response.statusText === "Too Many Requests") {
                token = process.env.NEXT_PUBLIC_HUGGING_FACE2;
                requestAPI();
            }
            return { done: true };
        }
    };

    while (true) {
        const result: any = await requestAPI();

        if (result.done) break;

        genText += result[0].generated_text;
    }

    console.log(genText);

    return Response.json({ msg: genText });
}
