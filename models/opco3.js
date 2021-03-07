var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");


var opco3Schema = mongoose.Schema({
  name:String,
  OpCo:String,
  password:String,
  username:String
});

var bcryptjs = require('bcryptjs')
opco3Schema.pre('save', function (next) {
  this.password = bcryptjs.hashSync(this.password, 10);
  next();
});

opco3Schema.statics.login = async function(username, password) {
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



opco3Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("OpCo3", opco3Schema);
