//entry point

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { connectVectorDB } from "./services/vectorStore.js";
import adminRoutes from "./routes/admin.js";
import queryRoutes from "./routes/query.js";

const app = express();
const port = process.env.PORT || 8000;

//middleware

app.use(cors());
app.use(express.json());

//routes

app.use("/api/admin", adminRoutes);
app.use("/api/query", queryRoutes);

//mongoose connection

const start = async () => {
  try {
    await connectDB();
    await connectVectorDB();

    app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  } catch (error) {
    console.error("mongo db connection error", error);
    process.exit(1);
  }
};

start();
