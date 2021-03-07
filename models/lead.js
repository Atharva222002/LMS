var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");
    const mongooseToCsv = require('mongoose-to-csv');

var leadSchema = mongoose.Schema({
  name:String,
  time:String,
  status:Array,
  curstatus:String,
  value:String,
  segment:String,
  Submitted_By:String,
  Submitted_To:String,
});
leadSchema.plugin(passportLocalMongoose);
leadSchema.plugin(mongooseToCsv, {
  headers: 'Submitted_By Submitted_To status',
  constraints: {
    'Submitted_By': 'Submitted_By',
    'Submitted_To': 'Submitted_To',
    'status': 'curstatus'
  }
});

module.exports = mongoose.model("Lead",leadSchema)