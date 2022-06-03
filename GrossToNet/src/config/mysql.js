require("dotenv").config();

module.exports = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: process.env.DB_PORT,
    user: "root",
    password: "root",
    database: process.env.DB_NAME,
  },
});
