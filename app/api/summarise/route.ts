export async function POST(request: Request) {
    const { workspace } = await request.json();
    console.log(workspace);
    // let prompt = `I am trying to brainstorm for my project and I have an agenda or a goal that I want to achieve and also a list of thoughts or half ideas that are somewhat connected and may lead to a good idea. Help me to summarise all this into a short, conside form so I can be productive. My agenda is ${workspace.agenda}. Here are some ideas that are connected to this agenda`;
    let prompt = `My agenda is ${workspace.agenda}`;
    for (let index = 0; index < workspace.ideas.length; index++) {
        prompt = prompt.concat(`
        ${index})${workspace.ideas[index].name}:${workspace.ideas[index].description}`);
    }

    console.log(prompt);
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE}`,
            },
            method: "POST",
            body: JSON.stringify({
                inputs: prompt,
            }),
        }
    );
    const result = await response.json();
    console.log("result", result);

    return Response.json({ msg: result[0]["summary_text"] });
}
