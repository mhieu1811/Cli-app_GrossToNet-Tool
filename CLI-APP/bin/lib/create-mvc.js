var fs = require("fs");
const readline = require("readline");
const Db = require("./database");
var exec = require("child_process").exec,
  child;

function generateMVC() {
  //Npm init + edit package.json
  child = exec("npm init -y ", function () {
    fs.readFile("package.json", "utf8", (err, data) => {
      if (err) throw err;
      var txt = JSON.parse(data);
      txt.scripts = {
        test: 'echo "Error: no test specified" && exit 1',
        start: "nodemon ./src/server.js",
      };
      const myJSON = JSON.stringify(txt, null, "\t");
      fs.writeFile("package.json", myJSON, "utf-8", function (err) {
        if (err) throw err;
      });
    });
  });

  //Install package
  child = exec(
    "npm install express dotenv nodemon body-parser path ejs objection",
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log("exec error: " + error);
      }
      console.log("Installed successful");
      ChooseDatabase();
    },
  );

  //Create MVC Folder
  var dir = [
    "./src",
    "./src/controllers",
    "./src/views",
    "./src/models",
    "./src/routes",
  ];
  dir.forEach((e) => {
    if (!fs.existsSync(e)) {
      fs.mkdirSync(e);
    }
  });
  generateDefaultController();
  generateDefaultRoute();
  generateDefaultView();

  //Apply DB + Create Server.js

  // Create server.js
  var app = `const express = require("express");
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
  
  app.use("/test", model);
  
  app.listen(port, () =>
    console.log("Example app listening on port " + port + "!")
  );`;

  fs.writeFile("./src/server.js", app, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });

  //Create .file .env
  var env = "PORT=8080\nDB_PORT=32769\nDB_NAME=myDb";
  fs.writeFile(".env", env, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
}

function generateDefaultController() {
  var file = `class ModelController {
   view(req, res) {
     res.render("index", { net: "" });
   }}
   module.exports = new ModelController();
`;
  fs.writeFile("./src/controllers/model.js", file, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
}

function generateDefaultView() {
  var file = `<h1>Hello</h1>`;
  fs.writeFile("./src/views/index.ejs", file, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
}
function generateDefaultRoute() {
  var file = `const express = require("express");
  const controller = require("../controllers/model");
  var router = express.Router();
  
  router.get("/", controller.view);
  
  module.exports = router;`;
  fs.writeFile("./src/routes/model.js", file, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
}
function ChooseDatabase() {
  const inquirer = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  inquirer.question(
    "Choose database (mysql or mongodb) (default: mongodb) ",
    (db) => {
      if (db == "mysql") {
        Db.mySql();
      } else {
        Db.mongoDb();
      }
      inquirer.close();
    },
  );
}
function generateModel() {
  var dir = "./src/models";
  if (!fs.existsSync(dir)) {
    console.log("Please Create Mvc first!!!");
  } else {
    const inquirer = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    inquirer.question("Model name: ", (name) => {
      var path = `./src/models/${name}.js`;
      var model;
      if (fs.existsSync("./src/config/mysql.js")) {
        model = `const { Model } = require("objection");

class ${name}Class extends Model {
  static get tableName() {
    return "${name}";
  }
}
module.exports = ${name}Class;`;
        if (!fs.existsSync(path)) {
          fs.writeFile(path, model, function (err) {
            if (err) throw err;
            // console.log("File is created successfully.");
          });
        } else {
          console.log("File already existed");
        }
      } else {
        model = `const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ${name}Schema = new Schema({
  name: { type: String, required: true },
})

const ${name} = mongoose.model('${name}', ${name}Schema);
module.exports = ${name};`;
        if (!fs.existsSync(path)) {
          fs.writeFile(path, model, function (err) {
            if (err) throw err;
            console.log("File is created successfully.");
          });
        } else {
          console.log("File already existed");
        }
      }

      inquirer.close();
    });
  }
}
module.exports = { generateMVC, generateModel };
