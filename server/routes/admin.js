import express from "express";
import Document from "../models/documents.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { ingestDocument } from "../services/rag.js";

const router = express.Router();

router.post("/upload", adminAuth, async (req, res) => {
  try {
    const { title, type, content } = req.body;
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

    res.json({ documents });
  } catch (error) {
    res.status(500).json({
      message: "error retrieving documents from server",
      error: error.message,
    });
  }
});

router.delete("/documents/:id", adminAuth, async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
});

export default router;

// router.post("./upload", adminAuth, async (req, res) => {
//   try {
//     const { title, content, type } = req.body;

//     const doc = await Document.create({
//       title,
//       content,
//       type,
//     });

//     await ingestDocument(title, type, content, doc_.id.toString());

//    const chunks = Math.ceil(content.length / 400);
//     await Document.findByIdAndUpdate(doc._id, { chunckCount: chunks });

//     res.status(201).json({
//       message: "DOcument uploaded and Indexed successfully",
//       document: {
//         id: doc._id,
//         title: doc.title,
//         type: doc.type,
//       },
//     });
//   } catch (error) {
//     console.log("error uploading document :", error);
//     res.status(500).json({
//       message: "server error",
//       error: error.messsage,
//     });
//   }
// });

// router.get("/documents", adminAuth, async (req, res) => {
//   try {
//     const documents = await Document.find().select("-content");

//     res.json({ documents });
//   } catch (error) {
//     res.status(500).json({
//       message: "server error",
//       error: error.message,
//     });
//   }
// });

// router.delete("/admin/documents/:id", adminAuth, async (res, req) => {
//   try {
//     await Document.findByIdAndDelete(req.params.id);
//     res.json({ message: "Document deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
