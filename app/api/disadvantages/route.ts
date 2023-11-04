export async function POST(request: Request) {
    const { idea }: { idea: Idea } = await request.json();

    console.log("processing...");

    let token = process.env.NEXT_PUBLIC_HUGGING_FACE;

    let prompt = `We have an idea: ${idea.name}. However, it has the following issues:\n`;
    let genText = ``;

    if (idea.cons) {
        idea.cons.blocks.map((block: any, i: number) => {
            prompt += `${i + 1}. ${block.data.text}.\n`;
        });
    }

    prompt += "\n\nSuggest some solutions to all of these issues.";

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
                        max_new_tokens: 250,
                    },
                }),
            }
        );

        if (response.ok) return await response.json();
        else {
            console.log(response);
            return { done: true };
        }
    };

    while (true) {
        const result: any = await requestAPI();

        if (result === undefined)
            return Response.json({ err: "Some error occurred" });
        if (result.done) break;
        if (result[0].generated_text === "") break;

        console.log(result);

        genText += result[0].generated_text;
    }

    console.log(genText);

    return Response.json({ msg: genText });
}
