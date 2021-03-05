// const leadSchema = new mongoose.Schema ({
//     by: { type: String, required: true },
//     from: { type: String, required: true },
//     status: { type: String, required: true }
// });



// leadSchema.plugin(mongooseToCsv, {
//     headers: 'by from status',
//     constraints: {
//       'by': 'by',
//       'from': 'from',
//       'status': 'status'
//     }
//   });
 
  // Lead.find({}).exec()
  //   .then(function(docs) {
  //     Lead.csvReadStream(docs)
  //       .pipe(fs.createWriteStream('leads.csv'));
  //   }).catch((err) => {
  //       console.log(error);
  //   })
 
// module.exports = Lead;