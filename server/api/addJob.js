import express from "express";

const addJob = express();

addJob.use(express.json());

addJob.get("/api/get", (req, res)=>{
    res.send("Welcome to our Server!");
})

addJob.post("/api/addJob", (req, res) => {
    console.log(req.body);
    res.send("Job added successfully");
});

export default addJob;