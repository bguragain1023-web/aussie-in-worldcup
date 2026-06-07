import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum:["player", "team", "match","opponent","history", "staff" ],
        required: true,
    },
    content:{
        type: String,
         required: true,
    },
    chunkCount: {
        type: Number,
        default: 0,
    },
},
{    timestamps: true,}
)
export default mongoose.model("Document", taskSchema);