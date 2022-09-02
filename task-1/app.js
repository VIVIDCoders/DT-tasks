const express = require("express");
const app = express();
require("dotenv").config();
const fileUpload = require("express-fileupload");
const events = require("./routes/event");

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// file upload
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))
// routes 
app.use("/api/v3/app", events);

module.exports = app;
