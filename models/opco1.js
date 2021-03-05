var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");


var opco1Schema = mongoose.Schema({
  name:String,
  OpCo:String,
  password:String,
  username:String
});
opco1Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("OpCo1", opco1Schema);