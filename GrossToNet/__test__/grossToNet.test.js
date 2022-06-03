const taxService = require("../src/service/grossToNet");
const mock = require("./grossToNet");
describe("Start unit test", () => {
  describe("Test insuranceCalculator function()", () => {
    test("gross is null, Should return 0", async () => {
      const gross = null;
      const area = "1";
      const name = "BHYT";
      const result = await mock.insuranceCalculator(area, gross, name);
      expect(result).toEqual(0);
    });
    test("area is null, Should return 0", async () => {
      const gross = 1200000;
      const area = null;
      const name = "BHYT";
      const result = await mock.insuranceCalculator(area, gross, name);
      expect(result).toEqual(0);
    });
    test("name is null, Should return 0", async () => {
      const gross = 1200000;
      const area = "1";
      const name = "";
      const result = await mock.insuranceCalculator(area, gross, name);
      expect(result).toEqual(0);
    });
    test("name is not-existent , Should return 0", async () => {
      const gross = 1200000;
      const area = "1";
      const name = "hehe";
      const result = await mock.insuranceCalculator(area, gross, name);
      expect(result).toEqual(0);
    });
    test("Everything is Correct, Should return valid result", async () => {
      const gross = 12000000;
      const area = "1";
      const name = "BHXH";
      const result = await mock.insuranceCalculator(area, gross, name);
      expect(result).toEqual(960000);
    });
    test("Insurance price is larger than max value they can reach, Should return max value", async () => {
      const gross = 50000000;
      const area = "1";
      const name = "BHXH";
      const result = await mock.insuranceCalculator(area, gross, name);
      expect(result).toEqual(2384000);
    });
  });
  describe("Test personalTax function()", () => {
    test("(Valid Case) salaryBeforetax is smaller than Family allowances", async () => {
      const salaryBeforeTax = 10740000;
      const min = 11000000;
      const result = await mock.personalTax(salaryBeforeTax, min);
      expect(result.net).toEqual(10740000);
      expect(result.personalTax).toEqual(0);
    });

    test("(Valid Case) salaryBeforetax is larger than Family allowances", async () => {
      const salaryBeforeTax = 11635000;
      const min = 11000000;
      const result = await mock.personalTax(salaryBeforeTax, min);
      expect(result.net).toEqual(11603250);
      expect(result.personalTax).toEqual(31750);
    });
    test("(InValid Case) salaryBeforeTax is invalid", async () => {
      const salaryBeforeTax = "invalid";
      const min = 11000000;
      const result = await mock.personalTax(salaryBeforeTax, min);
      expect(result).toEqual(NaN);
    });
    test("(InValid Case) Family allowances is invalid", async () => {
      const salaryBeforeTax = 11635000;
      const min = "invalid";
      const result = await mock.personalTax(salaryBeforeTax, min);
      expect(result).toEqual(NaN);
    });
  });
  describe("Test toNet function()", () => {
    test("(Valid Case) everything is valid", async () => {
      const depend = 0;
      const area = "1";
      const gross = 13000000;

      const result = await mock.toNet(depend, area, gross);
      expect(result.net).toEqual(11603250);
    });
    test("(InValid Case) Dependents is invalid(1)", async () => {
      const depend = -1;
      const area = "1";
      const gross = 13000000;

      const result = await mock.toNet(depend, area, gross);
      expect(result).toEqual(0);
    });
    test("(InValid Case) Dependents is invalid(2)", async () => {
      const depend = "ádas";
      const area = "1";
      const gross = 13000000;

      const result = await mock.toNet(depend, area, gross);
      expect(result).toEqual(NaN);
    });
  });
});
