import express from "express";
import axios from "axios";
import { PreInterviewBody } from "./types"

const app = express ()
app.use(express.json());

app.post("/api/v1/pre-interview", (req, res) => {
    const { success, data } = PreInterviewBody.safeParse(req.body);

    if (!success) {
        res.status(411).json({
            message: "Incorrect body"
        })
    }
})

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.listen(3001, () =>{
    console.log("port is listeing on port 3001")
})