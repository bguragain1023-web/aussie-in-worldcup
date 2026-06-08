import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const rerank = async(question, chunks) => {
    try {
        const scored = [];
        for (const chunk of chunks) {
            const response = await anthropic.messages.create({
                model:"claude-sonnet-4-5",
                max_tokens: 100,
                messages:[{
                    role:"user",
                    content: `Given this question: ${question} and this chunk of text: ${chunk}, how relevant is the chunk to the question on a scale of 1 to 10? Only respond with the number.`
                }]
               
            })

            const relevanceScore = await  response.json();
            scored.push({ chunk, score: parseInt(relevanceScore.content[0].text.trim()) });


            
        };
        
    } catch (error) {
            console.error("Error reranking chunks:", error);
            throw error;
    }
}