const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost:27017/todos", { useNewUrlParser: true })
  .then(() => {
    console.log("connection succesfully made");
  })
  .catch(error => {
    console.log("there was an error during the connection", error);
  });

// applying middlewares for CORS and bodyparser

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", todoRoutes);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

module.exports = app; // exporting the app in order to be able to test it
