//entry point 

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'



const app = express();
const port = process.env.PORT || 8000

//moddleware

app.use(cors())
app.use(express.json())

//test route

app.get("/", (req , res) =>{
    res.json({message: "AussIe in the worldcup API is running"})
})


//mongoose connection 

const start = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb connected")

        app.listen(port, () => {
            console.log(`server running on port ${port}`)
        })

    } catch (error) {
        console.error("mongo db connection error", error)
        process.exit(1)
    }
}

start()