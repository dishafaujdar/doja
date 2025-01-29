import express from "express";
import {route} from "./routes/v0"
import session from 'express-session';
const app = express();
app.use(express.json())

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set `true` if using HTTPS
  }));

  app.use("/api/v0" , route)

const PORT = 3000
app.listen(process.env.PORT || PORT , ()=>`Server running on ${PORT}`) 
