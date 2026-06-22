import express from "express";
import Document from "../models/documents.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { ingestDocument } from "../services/rag.js";
import { deleteChunksByDocumentId } from "../services/vectorStore.js";

const router = express.Router();

router.post("/upload", adminAuth, async (req, res) => {
  try {
    const { title, type, content } = req.body;

    if (req.role === "demo") {
      return res.status(403).json({
        message:
          "Demo user cannot perform this operation, try again with admin password",
      });
    }
    const doc = await Document.create({
      title,
      type,
      content,
    });

    await ingestDocument(title, content, type, doc._id.toString());

    const chunk = Math.ceil(content.length / 400);
    await Document.findByIdAndUpdate(doc._id, { chunkCount: chunk });

    res.status(201).json({
      message: "document succesfully uploaded",
      document: {
        id: doc._id,
        type: doc.type,
        title: doc.title,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "error uploading file from server",
      error: error.message,
    });
  }
});

router.get("/documents", adminAuth, async (req, res) => {
  try {
    const documents = await Document.find().select("-content");

    res.json({ documents, role: req.role });
  } catch (error) {
    res.status(500).json({
      message: "error retrieving documents from server",
      error: error.message,
    });
  }
});

router.delete("/documents/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.role === "demo") {
      return res.status(403).json({
        message:
          "Demo user cannot perform this operation, try again with admin password",
      });
    }
    await Document.findByIdAndDelete(id);

    const cleanId = String(id).trim();

    await deleteChunksByDocumentId(cleanId);

    res.json({ message: "Document deleted successsfully frm both databases" });
  } catch (error) {
    console.error("Delete route error:", error.message);
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
});

export default router;
