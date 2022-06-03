const { Model } = require("objection");

class Insurance extends Model {
  static get tableName() {
    return "insurance";
  }
}
module.exports = Insurance;
