import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRoutes from "./routesFolder/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
// const express = require("express");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
 
// middleware
app.use(cors({
    origin: "http://localhost:5173",
}))
app.use(express.json()); // this middleware will parse json bodies (req.body)
app.use(rateLimiter);


// our simple custom middleware
// app.use((req, res, next) => {
//     console.log(`Request method is ${req.method} & Request URL is ${req.url}`);
//     next();
// });

app.use("/api/notes", notesRoutes);

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("Server started on port", PORT);
    });
});

