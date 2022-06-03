const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const model = require("./routes/model");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static("public"));

app.use("/", model);
app.listen(port, () =>
  console.log("Example app listening on port " + port + "!")
);
const seed = require("./seeds/seed");
seed();
