import express from "express";
import addJob from "./api/addJob.js";
const app = express();
const port = 3000;

app.use(addJob);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});