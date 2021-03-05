var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");


var opco3Schema = mongoose.Schema({
  name:String,
  OpCo:String,
  password:String,
  username:String
});
opco3Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("opco3", opco3Schema);