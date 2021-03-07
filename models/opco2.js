var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");


var opco2Schema = mongoose.Schema({
  name:String,
  OpCo:String,
  password:String,
  username:String
});

var bcryptjs = require('bcryptjs')
opco2Schema.pre('save', function (next) {
  this.password = bcryptjs.hashSync(this.password, 10);
  next();
});

opco2Schema.statics.login = async function(username, password) {
  const user = await this.findOne({ "username" :  username });
  if (user) {
    const auth = await bcryptjs.compareSync(password , user.password)
    if (auth) {
      return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
};



opco2Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("OpCo2", opco2Schema);
