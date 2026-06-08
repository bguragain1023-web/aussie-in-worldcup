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
                    content: `Given this question: ${question} and this chunk of text: ${chunk.text}, how relevant is the chunk to the question on a scale of 1 to 10? Only respond with the number, nothing else.`
                }]
               
            })

            const score = parseInt(response.content[0].text.trim());
            scored.push({ ...chunk, rerankScore:score });


            
        };

        const reranked = scored.sort((a,b) => b.rerankScore - a.rerankScore);
        reranked.forEach((r,i)=>{
            console.log(`Rank ${i+1} : score ${r.rerankScore} - ${r.text.slice(0,60)}`)
        })

        return reranked;
        
    } catch (error) {
            console.error("Error reranking chunks:", error);
            throw error;
    }
}