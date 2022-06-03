const { Model } = require("objection");

class TaxLevel extends Model {
  static get tableName() {
    return "taxlevel";
  }
}
module.exports = TaxLevel;
