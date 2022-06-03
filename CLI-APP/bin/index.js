#! /usr/bin/env node
var buildApp = require("./lib/create-mvc");
var database = require("./lib/database");
// program
//   .command("create-project")
//   .alias("crpj")
//   .action(() => {
//     console.log(process.agrv);
//   });
// program
//   .command("connect-database")
//   .alias("cndb")
//   .action(() => {
//     database.ChooseDatabase();
//   });

// program.parse(program.agrv);
switch (process.argv[2]) {
  case "mvc":
    buildApp.generateMVC();
    break;
  case "model":
    buildApp.generateModel();
    break;
  case "seed":
    switch (process.argv[3]) {
      case "mysql":
        database.seedDataMysql();
        break;
      case "mongodb":
        database.seedDataMongo();
        break;
      default:
        break;
    }
    break;
  case "help":
    console.log(`
    Options:
        mvc          Create MVC project
        db           Create file config database (mysql or mongodb)
        model        Create new sample Model
    `);
    break;
  default:
    console.log(process.argv[2] + "not found");
    console.log(`
    Options:
        mvc          Create MVC project
        db           Create file config database (mysql or mongodb)
        model        Create new sample Model
    `);
  // code block
}
