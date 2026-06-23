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
  } catch (error) {
    console.error("Error ingesting document:", error);
    throw error;
  }
};

export const queryRAG = async (question, history = []) => {
  try {
    const lastTwoMessage = history.slice(-2);
    const historyAndQuery =
      lastTwoMessage.length > 0
        ? `${lastTwoMessage.map((m) => m.content).join(" ")} ${question}`
        : question;
    const questionVector = await generateEmbeddings(historyAndQuery);
    const results = await searchChunks(questionVector);

    if (results.length === 0) {
      const noResultResponse = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 200,
        system:
          "You are a friendly football assistant. Paraphrase this message in a slightly different but friendly way each time, keep it short, always end with a football emoji: 'I couldn't find anything on that! Try asking about the Socceroos squad, fixtures, history, or tactics.'",

        messages: [{ role: "user", content: "paraphrase" }],
      });

      return {
        answer: noResultResponse.content[0].text.trim(),
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
      system: `You are OzzyAI, a friendly and passionate Australian football expert specialising in the Socceroos at the 2026 FIFA World Cup. Answer questions using ONLY the context provided below. If the context doesn't contain enough information, respond warmly and suggest the user ask about the Socceroos squad, players, fixtures, tactics, or match results. Never make up information. context: ${context}`,
      messages: [
        ...history,
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
