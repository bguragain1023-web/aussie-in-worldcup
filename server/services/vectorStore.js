import { connect, MetricType } from "vectordb";

let table = null;
let db = null;

export const connectVectorDB = async () => {
  try {
    db = await connect("./lanceDB");

    const tableNAmes = await db.tableNames();

    if (tableNAmes.includes("chunks")) {
      table = await db.openTable("chunks");
      console.log("lanceDB table opened");
    } else {
      console.log("lanceDB connected, Table will be creataed in first Upload");
    }
  } catch (error) {
    console.error("Error connecting to vector database:", error);
    throw error;
  }
};

export const saveChunks = async (chunks) => {
  try {
    if (!table) {
      table = await db.createTable("chunks", chunks);
      console.log(`LanceDB create with ${chunks.length} chunks `);
    } else {
      await table.add(chunks);
      console.log("chunks saved to vector database");
    }
  } catch (error) {
    console.error("Error saving chunks to vector database:", error);
    throw error;
  }
};

export const searchChunks = async (queryVector) => {
  try {
    if (!table) {
      console.log("No tables found yet");
      return [];
    }

    const topK = parseInt(process.env.TOP_K) || 20;
    const similarity = parseFloat(process.env.MIN_SIMILARITY) || 0.15;
    const results = await table
      .search(queryVector)
      .metricType("cosine")
      .limit(topK)
      .execute();

    //temporary debug

    if (results.length > 0) {
      console.log("--- RAW DISTANCE SAMPLES FROM LANCE ---");
      results.slice(0, 3).forEach((res, index) => {
        console.log(
          `Match [${index}]: Distance = ${res._distance}, Text snippet: "${res.text?.substring(0, 50)}..."`,
        );
      });
    }

    const filteredResult = results.filter((result) => {
      const sim = 1 - result._distance;
      return sim >= similarity;
    });

    console.log(
      `${results.length} raw chunks found, ${filteredResult.length} passed the threshold of ${similarity}`,
    );

    console.log(
      `${results.length} retrieved, ${filteredResult.length} passed similarity`,
    );
    return filteredResult;
  } catch (error) {
    console.error("Error searching chunks in vector database:", error);
    throw error;
  }
};
