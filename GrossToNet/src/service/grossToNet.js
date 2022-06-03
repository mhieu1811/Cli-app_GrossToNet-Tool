const knex = require("../config/mysql");
const Insurance = require("../models/insurance");
const TaxLevel = require("../models/taxLevel");

// const knex = require("../lib/mysql");
const { Model } = require("objection");

Model.knex(knex);

async function insuranceCalculator(area, gross, name) {
  if (gross <= 0) {
    return 0;
  }
  if (name != "BHYT" && name != "BHXH" && name != "BHTN") {
    return 0;
  }
  if (parseInt(area) == NaN || area == null || area == 0) return 0;

  return (gross *
    (await Insurance.query().select("percent").where("name", `${name}`))[0]
      .percent) /
    100 >
    (await Insurance.query().select(`V${area}`).where("name", `${name}`))[0][
      `V${area}`
    ]
    ? (await Insurance.query().select(`V${area}`).where("name", `${name}`))[0][
        `V${area}`
      ]
    : (gross *
        (await Insurance.query().select("percent").where("name", `${name}`))[0]
          .percent) /
        100;
}

async function personalTax(salaryBeforeTax, min) {
  if (salaryBeforeTax <= 0 || min <= 0) {
    return 0;
  }
  if (typeof salaryBeforeTax == "string" || typeof min == "string") return NaN;
  var net = 0;
  var personalTax = 0;
  var taxableIncome = 0;
  var tax = await TaxLevel.query();

  if (salaryBeforeTax < min) {
    net = salaryBeforeTax;
  } else {
    taxableIncome = salaryBeforeTax - min;
    // var grossLeft = req.body.gross - insurance - min;
    tax.every((e) => {
      if (taxableIncome <= e.max || e.max == -1) {
        personalTax += ((taxableIncome - e.min) * e.percent) / 100;

        net = taxableIncome - personalTax + min;
        return false;
      }
      personalTax += e.max_tax_amount;
      return true;
    });
  }
  return { net: net, personalTax: personalTax };
}
async function toNet(depend, area, gross) {
  if (depend < 0) return 0;
  if (depend == null || typeof depend == "string") return NaN;
  var min = 11000000 + 4400000 * depend;
  var BHTN = await insuranceCalculator(area, gross, "BHTN");
  var BHYT = await insuranceCalculator(area, gross, "BHYT");
  var BHXH = await insuranceCalculator(area, gross, "BHXH");

  var salaryBeforeTax = gross - BHTN - BHXH - BHYT;
  var netSalary = await personalTax(salaryBeforeTax, min);
  return {
    personalTax: netSalary.personalTax,
    net: netSalary.net,
    BHYT: BHYT,
    BHXH: BHXH,
    BHTN: BHTN,
  };
}
module.exports = { personalTax, insuranceCalculator, toNet };
