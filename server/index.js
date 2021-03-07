const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const DEV_MODE = process.env.DEV_MODE === "true";

const app = express();

app.use(express.static(path.join(__dirname, "/../client/build")));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/build/index.html"));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
