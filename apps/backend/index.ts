import express from "express";

const app = express ()
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.listen(3001, () =>{
    console.log("port is listeing on port 3001")
})