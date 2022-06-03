const knex = require("../config/mysql");
require("dotenv").config();
module.exports = function () {
  knex.raw("CREATE DATABASE IF NOT EXISTS ??", process.env.DB_NAME).catch();

  knex.schema
    .createTableIfNotExists("result", function (t) {
      t.increments("id").primary();
      t.integer("gross");
      t.integer("area");
      t.integer("depend");
      t.integer("healthInsurance");
      t.integer("socialInsurance");
      t.integer("unemploymentInsurance");
      t.integer("tax");
      t.integer("net");
    })
    .catch();
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
};
