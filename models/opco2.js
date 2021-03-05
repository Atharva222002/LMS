var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");


var opco2Schema = mongoose.Schema({
  name:String,
  OpCo:String,
  password:String,
  username:String
});
opco2Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("opco2", opco2Schema);