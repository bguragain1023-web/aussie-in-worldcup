import express from "express";
import { queryRAG } from "../services/rag.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, history } = req.body;
    const response = await queryRAG(question, history);
    res.status(200).json({
      responses: {
        response: response.answer,
        source: response.source,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "something went worng",
      error: error.message,
    });
  }
});

export default router;
