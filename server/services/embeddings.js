
import openAI from "openai"

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY
})  

export const generateEmbeddings = async(text)=>{
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
            encoding_format: "float",
        })
        return response.data[0].embedding;
    } catch (error) {
        console.error("Error generating embeddings:", error);
        throw error;
    }

}