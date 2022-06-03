const Service = require("../src/service/grossToNet");

exports.insuranceCalculator = async (area, gross, name) => {
  const data = await Service.insuranceCalculator(area, gross, name);
  switch (data) {
    case 0:
      return 0;
    case NaN:
      return NaN;
    default:
      return data;
  }
};
exports.personalTax = async (salaryBeforeTax, min) => {
  const data = await Service.personalTax(salaryBeforeTax, min);
  switch (data) {
    case 0:
      return 0;
    case NaN:
      return NaN;
    default:
      return data;
  }
};
exports.toNet = async (depend, area, gross) => {
  const data = await Service.toNet(depend, area, gross);
  switch (data) {
    case 0:
      return 0;
    case NaN:
      return NaN;
    default:
      return data;
  }
};
