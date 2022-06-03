const { Model } = require("objection");

class ModelClass extends Model {
  static get tableName() {
    return "user";
  }
}
module.exports = ModelClass;
