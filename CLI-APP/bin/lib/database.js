const readline = require("readline");
var fs = require("fs");
var exec = require("child_process").exec,
  child;

function mySql() {
  const inquirer = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  var dir = "./src/config";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  var text = `require("dotenv").config();

  module.exports = require("knex")({
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  });`;
  fs.writeFile("./src/config/mysql.js", text, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
  child = exec("npm install mysql knex", function (error, stdout, stderr) {
    if (error !== null) {
      console.log("exec error: " + error);
    }
    // console.log("Installed successful Mysql + Sequelize");
  });
}

function mongoDb() {
  var dir = "./src/config";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // module.exports = { conn };`;
  var text = `const mongoose = require("mongoose");

  class Database {
    contructor() {}
    connect() {
      const url =
        "mongodb://localhost:" + process.env.DB_PORT + "/" + process.env.DB_NAME;
        mongoose
        .connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          console.log("Successfully connected to the database");
        })
        .catch((err) => {
          console.log("Could not connect to the database. Exiting now...", err);
          process.exit();
        });
    }
    close() {
      mongoose.connection.close();
    }
  }
  module.exports = new Database();`;

  fs.writeFile("./src/config/mongodb.js", text, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
  var text = `\nconst db = require("./config/mongodb.js");
db.connect();`;
  fs.appendFile("./src/server.js", text, (err) => {});

  child = exec(
    "npm install mongodb mongoose",
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log("exec error: " + error);
      }
      // console.log("Installed successful MongoDb + Mongoose");
    },
  );
}

function seedDataMysql() {
  var seedFile = `const knex = require("../config/mysql");
require("dotenv").config();
module.exports = function () {
  knex.raw("CREATE DATABASE IF NOT EXISTS ??", process.env.DB_NAME).catch();
  knex.schema
    .createTableIfNotExists("taxlevel", function (t) {
      t.increments("id").primary();
      t.integer("min");
      t.integer("max");
      t.integer("percent");
      t.integer("max_tax_amount");
    })
    .then(async () => {
      const count = await knex.select().table("taxlevel");
      if (count.length == 0) {
        knex("taxlevel")
          .insert([
            {
              min: 0,
              max: 5000000,
              percent: 5,
              max_tax_amount: 250000,
            },
            {
              min: 5000000,
              max: 10000000,
              percent: 10,
              max_tax_amount: 500000,
            },
            {
              min: 10000000,
              max: 18000000,
              percent: 15,
              max_tax_amount: 1200000,
            },
            {
              min: 18000000,
              max: 32000000,
              percent: 20,
              max_tax_amount: 2800000,
            },
            {
              min: 32000000,
              max: 52000000,
              percent: 25,
              max_tax_amount: 5000000,
            },
            {
              min: 52000000,
              max: 80000000,
              percent: 30,
              max_tax_amount: 8400000,
            },
            {
              min: 80000000,
              max: -1,
              percent: 35,
              max_tax_amount: -1,
            },
          ])
          .then(() => {});
      }
    });
  knex.schema
    .createTableIfNotExists("insurance", function (t) {
      t.increments("id").primary();
      t.string("name");
      t.integer("V1");
      t.integer("V2");
      t.integer("V3");
      t.integer("V4");
      t.double("percent");
    })
    .then(async () => {
      const count = await knex.select().table("insurance");
      if (count.length == 0) {
        knex("insurance")
          .insert([
            {
              name: "BHYT",
              V1: 447000,
              V2: 447000,
              V3: 447000,
              V4: 447000,
              percent: 1.5,
            },
            {
              name: "BHXH",
              V1: 2384000,
              V2: 2384000,
              V3: 2384000,
              V4: 2384000,
              percent: 8,
            },
            {
              name: "BHTN",
              V1: 884000,
              V2: 784000,
              V3: 686000,
              V4: 614000,
              percent: 1,
            },
          ])
          .then(() => {});
      }
    });
};`;
  var dir = "./src/seeds";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFile("./src/seeds/seed.js", seedFile, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
  var text = `\nconst seed = require("./seeds/seed");
seed();`;
  fs.appendFile("./src/server.js", text, (err) => {});
}
function seedDataMongo() {
  var insurance = `const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  
  const insuranceSchema = new Schema({
    name: { type: String, required: true },
    V1: { type: Number, required: true },
    V2: { type: Number, required: true },
    V3: { type: Number, required: true },
    V4: { type: Number, required: true },
    percent: { type: Number, required: true },
  });
  
  const insurance = mongoose.model("insurance", insuranceSchema);
  module.exports = insurance;`;
  fs.writeFile("./src/models/insurance.js", insurance, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
  var taxlevel = `const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taxLevelSchema = new Schema({
  level: { type: Number, required: true },
  percent: { type: Number, required: true },
  max_tax_amount: { type: Number },
});

const taxLevel = mongoose.model("taxLevel", taxLevelSchema);
module.exports = taxLevel;
`;
  fs.writeFile("./src/models/taxLevel.js", taxlevel, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
  var seed = `const insurance = require("../models/insurance");
  const taxLevel = require("../models/taxLevel");
  const db = require("../config/mongodb.js");
  
  module.exports = async function () {
    taxLevel.countDocuments({ name: "anand" }, async function (err, c) {
      if (c == 0) {
        await taxLevel.insertMany([
          {
            level: 5000000,
            percent: 5,
            max_tax_amount: 250000,
          },
          {
            level: 10000000,
            percent: 10,
            max_tax_amount: 500000,
          },
          {
            level: 18000000,
            percent: 15,
            max_tax_amount: 1200000,
          },
          {
            level: 32000000,
            percent: 20,
            max_tax_amount: 2800000,
          },
          {
            level: 52000000,
            percent: 25,
            max_tax_amount: 5000000,
          },
          {
            level: 80000000,
            percent: 30,
            max_tax_amount: 8400000,
          },
          {
            level: -1,
            percent: 35,
            max_tax_amount: 0,
          },
        ]);
      }
    });
    insurance.countDocuments({ name: "anand" }, async function (err, c) {
      if (c == 0) {
        await insurance.insertMany([
          {
            name: "BHYT",
            V1: 447000,
            V2: 447000,
            V3: 447000,
            V4: 447000,
            percent: 1.5,
          },
          {
            name: "BHXH",
            V1: 2384000,
            V2: 2384000,
            V3: 2384000,
            V4: 2384000,
            percent: 8,
          },
          {
            name: "BHTN",
            V1: 884000,
            V2: 784000,
            V3: 686000,
            V4: 614000,
            percent: 1,
          },
        ]);
      }
    });
  };
  `;
  var dir = "./src/seeds";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFile("./src/seeds/seed.js", seed, function (err) {
    if (err) throw err;
    // console.log("File is created successfully.");
  });
  var text = `\nconst seed = require("./seeds/seed");
seed();`;
  fs.appendFile("./src/server.js", text, (err) => {});
}

module.exports = { mySql, mongoDb, seedDataMysql, seedDataMongo };
