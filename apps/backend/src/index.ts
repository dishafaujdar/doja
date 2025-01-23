import express from "express";
import {route} from "./routes/v0"
const app = express();
app.use(express.json())

app.use("/api/v0" , route)

const PORT = 3000
app.listen(process.env.PORT || PORT , ()=>`Server running on ${PORT}`) 
