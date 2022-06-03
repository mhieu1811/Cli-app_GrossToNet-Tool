const knex = require("../config/mysql");
const Insurance = require("../models/insurance");
const TaxLevel = require("../models/taxLevel");
const Service = require("../service/grossToNet");
// const knex = require("../lib/mysql");
const { Model } = require("objection");

Model.knex(knex);
class IndexController {
  view(req, res) {
    res.render("index", {
      net: "",
      gross: "",
      socialInsurance: "",
      healthInsurance: "",
      unemploymentInsurance: "",
      tax: "",
      noti: "Gross Slary is required",
    });
  }
  async grossToNet(req, res) {
    // var BHYT =
    //   (gross *
    //     (await Insurance.query().select("percent").where("name", "BHYT"))[0]
    //       .percent) /
    //     100 >
    //   (await Insurance.query().select("V1").where("name", "BHYT"))[0].V1
    //     ? (await Insurance.query().select("V1").where("name", "BHYT"))[0].V1
    //     : (gross *
    //         (await Insurance.query().select("percent").where("name", "BHYT"))[0]
    //           .percent) /
    //       100;
    // var BHXH =
    //   (gross *
    //     (await Insurance.query().select("percent").where("name", "BHXH"))[0]
    //       .percent) /
    //     100 >
    //   (await Insurance.query().select("V1").where("name", "BHXH"))[0].V1
    //     ? (await Insurance.query().select("V1").where("name", "BHXH"))[0].V1
    //     : (gross *
    //         (await Insurance.query().select("percent").where("name", "BHXH"))[0]
    //           .percent) /
    //       100;
    // var BHTN;
    // switch (area) {
    //   case "1":
    //     BHTN =
    //       (gross *
    //         (await Insurance.query().select("percent").where("name", "BHTN"))[0]
    //           .percent) /
    //         100 >
    //       (await Insurance.query().select("V1").where("name", "BHTN"))[0].V1
    //         ? (await Insurance.query().select("V1").where("name", "BHTN"))[0].V1
    //         : (gross *
    //             (
    //               await Insurance.query()
    //                 .select("percent")
    //                 .where("name", "BHTN")
    //             )[0].percent) /
    //           100;
    //     break;
    //   case "2":
    //     BHTN =
    //       (gross *
    //         (await Insurance.query().select("percent").where("name", "BHTN"))[0]
    //           .percent) /
    //         100 >
    //       (await Insurance.query().select("V2").where("name", "BHTN"))[0].V1
    //         ? (await Insurance.query().select("V2").where("name", "BHTN"))[0].V1
    //         : (gross *
    //             (
    //               await Insurance.query()
    //                 .select("percent")
    //                 .where("name", "BHTN")
    //             )[0].percent) /
    //           100;
    //     break;
    //   case "3":
    //     BHTN =
    //       (gross *
    //         (await Insurance.query().select("percent").where("name", "BHTN"))[0]
    //           .percent) /
    //         100 >
    //       (await Insurance.query().select("V3").where("name", "BHTN"))[0].V1
    //         ? (await Insurance.query().select("V3").where("name", "BHTN"))[0].V1
    //         : (gross *
    //             (
    //               await Insurance.query()
    //                 .select("percent")
    //                 .where("name", "BHTN")
    //             )[0].percent) /
    //           100;
    //     break;
    //   case "4":
    //     BHTN =
    //       (gross *
    //         (await Insurance.query().select("percent").where("name", "BHTN"))[0]
    //           .percent) /
    //         100 >
    //       (await Insurance.query().select("V4").where("name", "BHTN"))[0].V1
    //         ? (await Insurance.query().select("V4").where("name", "BHTN"))[0].V1
    //         : (gross *
    //             (
    //               await Insurance.query()
    //                 .select("percent")
    //                 .where("name", "BHTN")
    //             )[0].percent) /
    //           100;
    //     break;
    // }
    // if (salaryBeforeTax < min) {
    //   net = salaryBeforeTax;
    // } else {
    //   taxableIncome = salaryBeforeTax - min;
    //   // var grossLeft = req.body.gross - insurance - min;
    //   tax.every((e) => {
    //     if (taxableIncome <= e.max || e.max == -1) {
    //       personalTax += ((taxableIncome - e.min) * e.percent) / 100;

    //       net = taxableIncome - personalTax + min;
    //       return false;
    //     }
    //     personalTax += e.max_tax_amount;
    //     return true;
    //   });
    // }
    var gross = req.body.gross;
    var depend = req.body.dependents;
    var area = req.body.area;
    if (gross <= 0 || gross == "") {
      return res.render("index", {
        net: "",
        gross: "",
        socialInsurance: "",
        healthInsurance: "",
        unemploymentInsurance: "",
        tax: "",
        noti: "Gross Slary is required",
      });
    }
    var result = await Service.toNet(depend, area, gross);
    // var min = per + 4400000 * depend;
    // var BHTN = await Service.insuranceCalculator(area, gross, "BHTN");
    // var BHYT = await Service.insuranceCalculator(area, gross, "BHYT");
    // var BHXH = await Service.insuranceCalculator(area, gross, "BHXH");

    // var salaryBeforeTax = gross - BHTN - BHXH - BHYT;
    // var netSalary = await Service.personalTax(salaryBeforeTax, min);
    knex("result")
      .insert([
        {
          gross: gross,
          area: area,
          healthInsurance: result.BHYT,
          socialInsurance: result.BHXH,
          unemploymentInsurance: result.BHTN,
          tax: result.personalTax,
          depend: depend,
          net: result.net,
        },
      ])
      .catch();
    res.render("index", {
      net: result.net,
      gross: gross,
      socialInsurance: -result.BHXH,
      healthInsurance: -result.BHYT,
      unemploymentInsurance: -result.BHTN,
      tax: -result.personalTax,
      noti: "",
    });
  }
}
module.exports = new IndexController();
