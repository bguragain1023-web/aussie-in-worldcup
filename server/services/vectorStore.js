import { connect } from "vectordb";

let table = null;

export const connectVectorDB = async () => {
  try {
    const db = await connect("./lanceDB");

    const tableNAmes = await db.tableNames();

    if (tableNAmes.includes("chunks")) {
      table = await db.openTable("chunks");
      console.log("lanceDB table opened");
    } else {
      table = await db.createTable("chunks", [
        {
          vector: Array(1536).fill(0), // embedding vector
          text: "",
          title: "",
          documentId: "",
          type: "",
        },
      ]);
      console.log("lanceDB table created");
    }
  } catch (error) {
    console.error("Error connecting to vector database:", error);
    throw error;
  }
};

export const saveChunks = async (chunks) => {
  try {
    await table.add(chunks);
    console.log("chunks saved to vector database");
  } catch (error) {
    console.error("Error saving chunks to vector database:", error);
    throw error;
  }
};

export const searchChunks = async (queryVector) => {
  try {
    const topK = parseInt(process.env.TOP_K) || 20;
    const similarity = parseFloat(process.env.MIN_SIMILARITY) || 0.75;
    const results = await table.search(queryVector).limit(topK).execute();
    const filteredResult = results.filter((result) => {
      const sim = 1 - result._distance;
      return sim >= similarity;
    });
    console.log(
      `${results.length} retrieved, ${filteredResult.length} passed similarity`,
    );
    return filteredResult;
  } catch (error) {
    console.error("Error searching chunks in vector database:", error);
    throw error;
  }
};

export const getRawResults = async (queryVector) => {
  const results = await table.search(queryVector).limit(20).execute();
  return results;
};
