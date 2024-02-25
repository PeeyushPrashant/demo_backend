import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: "./env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`App listening at port : ${process.env.PORT}`)
    })
})
.catch(()=>{
    console.log("MongoDB connection failed")
})

// const app = express()

// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error)=>{
//            console.log("ERR:",error)
//            throw error
//         })
//         app.listen(process.env.PORT , ()=>{
//             console.log(`Listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log("ERROR:",error)
//     }
// })()