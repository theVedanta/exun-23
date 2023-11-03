import { OutputBlockData, OutputData } from "@editorjs/editorjs";

export async function POST(request: Request) {
    const { workspace }: { workspace: Workspace } = await request.json();
    if (!workspace || !workspace.ideas) return;

    console.log("processing...");

    let prompt = `We're working on ${workspace.agenda} and so far we have come up with the following ideas: \n`;

    for (let i = 0; i < workspace.ideas.length; i++) {
        const idea = workspace.ideas[i];
        let ideaLine = `${i + 1}. ${idea.name}: ${idea.description}`;

        if (idea.notes) {
            idea.notes.blocks.map((block: any) => {
                ideaLine += `. ${block.data.text}`;
            });
        }

        prompt += ideaLine + "\n";
    }

    console.log(prompt);

    // for (let index = 0; index < workspace.ideas.length; index++) {
    //     prompt = prompt.concat(`
    //     ${index})${workspace.ideas[index].name}:${workspace.ideas[index].description}`);
    // }

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

    return Response.json({ msg: result[0]["summary_text"] });
}
