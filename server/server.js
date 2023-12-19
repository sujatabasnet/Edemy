import express from "express";
import cors from "cors";
import { readdirSync } from "fs"; //core nodejs module no need to install
import mongoose from "mongoose";
import csurf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");
// import morgan from "morgan"
require("dotenv").config();

const csrfProtection = csurf({ cookie: true });

//create express app
const app = express();

//apply middlewares
//something that will run in the server before responses are sent back to the client
app.use(cors());
app.use(cookieParser());
app.use(express.json({limit: "5mb"})); //unless we dont have this applied, we will not have access to req.body
app.use(morgan("dev")); //this helps us know on which endpoint of the server the request is made and with which method(get/post)
app.use((req, res, next) => {
  console.log("this is my own middleware");
  next();
});
//middleware should always be a function
//middlewares also have access to req and res
//any middleware should have a callback func or else it will stop the code execution there

mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));
//route
//we will have several routes/endpoints so will make them in different files
//how to import??
readdirSync("routes").map((r) => app.use("/api", require(`./routes/${r}`)));
//we use the filesystem to load the routes directory
//we will map through each of them(r) and apply them as middleware by prefixing with api
//no need to manually import each time we create a new route/file

//csrf
app.use(csrfProtection);

//creating endpoint
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken });
});

//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server is running on port ${port}`)); //using backticks we can embed variable like port here
