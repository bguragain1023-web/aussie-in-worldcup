import Anthropic from "@anthropic-ai/sdk";

import { chunkText } from "./chunker.js";
import { generateEmbeddings } from "./embeddings.js";
import { saveChunks, searchChunks } from "./vectorStore.js";
import { rerank } from "./reranker.js";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const ingestDocument = async (title, text, type, documentId) => {
  try {
    const chunkObject = [];
    const chunks = chunkText(text, title);

    for (const chunk of chunks) {
      const vector = await generateEmbeddings(chunk);
      chunkObject.push({
        vector,
        title,
        text: chunk,
        documentId,
        type,
      });
    }
    await saveChunks(chunkObject);
    console.log(`${chunkObject.length} chunks ingested for: ${title}`);
  } catch (error) {
    console.error("Error ingesting document:", error);
    throw error;
  }
};

export const queryRAG = async (question) => {
  try {
    const questionVector = await generateEmbeddings(question);

    const results = await searchChunks(questionVector);
    if (results.length === 0) {
      return {
        answer:
          "I don't have the information to answer this question. Try asking related questions to Socceroos information related to World Cup 2026.",
        source: [],
      };
    }
    const rerankedresults = await rerank(question, results);
    const topChunk = rerankedresults.slice(0, 3);
    const context = topChunk.map((c) => c.text).join("\n");
    const source = [...new Set(topChunk.map((c) => c.title))];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: `You are TactixAI, an expert football analyst specialising in the Australian Socceroos at the 2026 World Cup. Answer questions using ONLY the context provided below. If the context doesn't contain enough information, say "I don't have that information in my database." Never make up information. context: ${context}`,
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });
    const answer = response.content[0].text.trim();

    return { answer, source };
  } catch (error) {
    console.error("Error querying RAG:", error);
    throw error;
  }
};
