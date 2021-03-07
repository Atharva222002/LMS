var express      = require("express"),
        app      = express(),
        http = require('http').Server(app),
        io = require('socket.io')(http),
        mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  passport       = require("passport"),
  bcryptjs = require('bcryptjs')
  LocalStrategy  = require("passport-local"),
        // seedDB   = require("./seeds"),
        OpCo1 = require("./models/opco1");
        OpCo2 = require("./models/opco2");
        OpCo3 = require("./models/opco3");
            Lead = require("./models/lead");
          checkLogin=  require("./middleware/checkLogin")
      const mongodb = require("mongodb").MongoClient;
const fastcsv = require("fast-csv");
const objectstocsv = require('objects-to-csv')
const fs = require("fs");
const mongooseToCsv = require('mongoose-to-csv');
var tokenGneration = require('./modules/generateToken');


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const company1=require("./models/opco1");

const opco1 = require("./models/opco1");
const { all } = require("./routes/indexRoutes");
 var indexRoutes = require("./routes/indexRoutes");       
const lead = require("./models/lead");

app.use( express.static( "public" ) );
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

mongoose.connect('mongodb://user1:psw1@lms-shard-00-00.hlrp5.mongodb.net:27017,lms-shard-00-01.hlrp5.mongodb.net:27017,lms-shard-00-02.hlrp5.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-tgi1cr-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(require("express-session")({
    secret:"Once again, Rusty wins cutest dog",
    resave:false,
    saveUninitialized:false
  }));

app.use(passport.initialize());
app.use(passport.session());
//passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + "public"));

app.use("/",indexRoutes);


// // SIGN UP LOGIC
app.post("/register",async function(req,res){
  const {name,OpCo,username,password} = req.body;
  var model=opco1
  var findVar={
    opcom1:"OpCo1",
    opcom2:"OpCo2",
    opcom3:"OpCo3"
  }
  var findOpCo={
    opcom1:OpCo1,
    opcom2:OpCo2,
    opcom3:OpCo3
  }
  for (var key in findVar) {
    if (findVar[key]===OpCo) {
        model=findOpCo[key]
        break
    }
}
try {
  const user = await model.create({ "name" : name, "OpCo" : OpCo , "username" : username, "password" : password});
  var token = tokenGneration(user._id);
  res.cookie('jwt', token, { httpOnly: true  });
  res.redirect("/home");
}
catch(err) {
  console.log(err)
  res.render("msg",{msg:"Invalid Data"})
}

  // var newUser = new model({name:name,OpCo:OpCo,username:username,password:psw});
  //   model.register(newUser, req.body.password, function(err,user){
  //     if (err) {
  //       console.log(err.message)
  //       return res.render("register");  
  //     } 
  //     console.log(model)
  //       passport.authenticate("local")(req,res,function(){
  //       res.redirect("/home");
  //       })
  //   });
});

// HANDLING  LOGIN LOGIC
app.post('/login',async (req, res, next) => {
  var model=opco1
  var findVar={
    opcom1:"opco1",
    opcom2:"opco2",
    opcom3:"opco3"
  }
  var findOpCo={
    opcom1:OpCo1,
    opcom2:OpCo2,
    opcom3:OpCo3
  }
  for (var key in findVar) {
    var username=req.body.username
    if (username.includes(findVar[key])) {
        model=findOpCo[key]
        break}}
        

        try {
          const user = await model.login(username, req.body.password);
          var token = tokenGneration(user._id);
          localStorage.setItem('EMAIL' , username);
          res.cookie('jwt', token, { httpOnly: true  }); 
          //res.status(200).json({ user: user._id });
          res.redirect("/home")
      } catch (err) {
          //res.status(400).json({msg:"Invalid credentials"});
          res.render("msg",{msg:"Invalid credentials"})
      }
});

var getUser
app.get("/home",checkLogin,function(req,res){
  getUser=localStorage.getItem("EMAIL")
  res.render("home")
})

// app.post("/form",checkLogin, function(req,res){
//   const {name,value,segment,to} = req.body;
//   var newLead = new Lead({name:name,time:new Date(),status:"open",value:value,segment:segment,Submitted_By:localStorage.getItem("EMAIL"),Submitted_To:to});
//   newLead.save()
//   console.log("Lead Generated")
//   res.redirect(`/home`)
// });

app.get("/leads",checkLogin,async function(req,res){
  var allLeads= await lead.find({Submitted_To:localStorage.getItem("EMAIL")})
  console.log(allLeads)
  res.render("leads",{allLeads:allLeads});
});

app.get("/leadSent",checkLogin,async function(req,res){
  var allLeads= await lead.find({Submitted_By:localStorage.getItem("EMAIL")})
  console.log(allLeads)
  res.render("leadSent",{allLeads:allLeads});
});

app.get("/form",checkLogin,function(req,res){
  res.render("form",{username:localStorage.getItem("EMAIL")});
});

app.get("/home/csv",checkLogin,async function(req,res){
  const query = lead.find({Submitted_By:localStorage.getItem("EMAIL")},{_id:0,Submitted_By:1,Submitted_To:1,curstatus:1})
  let list = await query.lean().exec();
  const query1 = lead.find({Submitted_To:localStorage.getItem("EMAIL")},{_id:0,Submitted_By:1,Submitted_To:1,curstatus:1})
  let list1 = await query1.lean().exec();
  var list2=list.concat(list1)
  const csv = new objectstocsv(list2);
  // Save to file:

  setTimeout(async()=>{
    await csv.toDisk('./details.csv');
    res.download("./details.csv", () => {
    fs.unlinkSync("./details.csv")
    })
  },4000);

});


app.post("/form",(req,res)=>{
  var newLead = new Lead({name:req.body.name,status:{label:"open",time:new Date()},curstatus:"open",value:req.body.value,segment:req.body.segment,Submitted_By:req.body.from,Submitted_To:req.body.to});
  newLead.save()
  console.log("Lead Generated")
  res.render("msg",{msg:"Lead send successfully"})
});

app.get('/chart' ,(req,res)=>{
  res.render('chart');
})

app.get("/api/data" ,async (req ,res)=>{
  console.log("Api called");
  var open = await lead.find({curstatus:"open"})
  var closed = await lead.find({curstatus:"close"})
  var validated = await lead.find({curstatus:"validated"})
  var rejected = await  lead.find({curstatus:"rejected"})
  if(open.length !== undefined && closed.length !== undefined &&validated.length !== undefined && rejected.length !== undefined ){
    res.send({open : open.length , closed : closed.length , validated : validated.length , rejected : rejected.length});
  }
})

app.get("/leads/open",checkLogin,async function(req,res){
  var allLeads= await lead.find({Submitted_To:localStorage.getItem("EMAIL")})
  var openLeads=allLeads.filter(x => x.curstatus==="open")
  res.render("leads",{allLeads:openLeads});
});
app.get("/leads/closed",checkLogin,async function(req,res){
  var allLeads= await lead.find({Submitted_To:localStorage.getItem("EMAIL")})
  var closeLeads=allLeads.filter(x => x.curstatus==="close")
  res.render("leads",{allLeads:closeLeads});
});
app.get("/leads/validated",checkLogin,async function(req,res){
  var allLeads= await lead.find({Submitted_To:localStorage.getItem("EMAIL")})
  var validatedLeads=allLeads.filter(x => x.curstatus==="validated")
  res.render("leads",{allLeads:validatedLeads});
});
app.get("/leads/rejected",checkLogin,async function(req,res){
  var allLeads= await lead.find({Submitted_To:localStorage.getItem("EMAIL")})
  var rejectedLeads=allLeads.filter(x => x.curstatus==="rejected")
  res.render("leads",{allLeads:rejectedLeads});
});

app.post("/leads/:id/reject",checkLogin, function(req, res){
  Lead.findById(req.params.id, function(err,user){
      if (err) {
          res.redirect("/leads");
      } else {
          user.status.push({label:"rejected",time:new Date()})
          user.curstatus="rejected"
          user.save()
          res.redirect("/leads");
      }
  })
});

app.post("/leads/:id/accept",checkLogin, function(req, res){
  Lead.findById(req.params.id, function(err,user){
      if (err) {
          res.redirect("/leads");
      } else {
          user.status.push({label:"validated",time:new Date()})
          user.curstatus="validated"
          user.save()
          res.redirect("/leads");
      }
  })
});

app.post("/leads/:id/close",checkLogin, function(req, res){
  Lead.findById(req.params.id, function(err,user){
      if (err) {
          res.redirect("/leads");
      } else {
          user.status.push({label:"close",time:new Date()})
          user.curstatus="close"
          user.save()
          res.redirect("/leads");
      }
  })
});

app.get("/api/data" ,async (req ,res)=>{
  console.log("Api called");
  var open = await lead.find({curstatus:"open"})
  var closed = await lead.find({curstatus:"close"})
  var validated = await lead.find({curstatus:"validated"})
  var rejected = await  lead.find({curstatus:"rejected"})
  if(open.length !== undefined && closed.length !== undefined &&validated.length !== undefined && rejected.length !== undefined ){
    res.send({open : open.length , closed : closed.length , validated : validated.length , rejected : rejected.length});
  }
})

app.get('/api/barData', async (req,res)=>{ 
  
  var allRecords = [];
  var allSegments = await lead.find({},{segment : 1});
  allSegments.forEach((s)=>{
    var LeadsinSegment =   lead.find({segment : s.segment}, (error,data)=>{
      if(error)
      console.log(error)
      console.log(data.length + " " + s.segment); 
      allRecords.push(  s.segment )
      allRecords.push(  data.length );
    })
  })  
  setTimeout(()=>{
    console.log(allRecords.length);
  
    res.send(allRecords)
  },2500)
})
 
app.get('/chart1' ,(req,res)=>{
  res.render('chart1');
})

app.get('/logout',(req,res)=>{
  localStorage.removeItem("EMAIL")
  localStorage.removeItem("tocken")
  res.redirect("/")
})

http.listen(process.env.PORT || 80, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  })
