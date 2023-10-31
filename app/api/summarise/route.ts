export async function GET(request: Request) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE}`,
            },
            method: "POST",
            body: JSON.stringify({
                inputs: ``,
            }),
        }
    );
    const result = await response.json();
    console.log(result);

    return Response.json({ msg: "Hello World" });
}
