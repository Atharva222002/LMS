var express      = require("express"),
        app      = express(),
        http = require('http').Server(app),
        io = require('socket.io')(http),
        mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  passport       = require("passport"),
  LocalStrategy  = require("passport-local"),
        // seedDB   = require("./seeds"),
        OpCo1 = require("./models/opco1");
        OpCo2 = require("./models/opco2");
        OpCo3 = require("./models/opco3");
            Lead = require("./models/lead"),
      middleware = require("./middleware");
      const mongodb = require("mongodb").MongoClient;
const fastcsv = require("fast-csv");
const objectstocsv = require('objects-to-csv')
const fs = require("fs");
const mongooseToCsv = require('mongoose-to-csv');

const company1=require("./models/opco1");

const middlewareObj = require("./middleware");
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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
  });

app.use("/",indexRoutes);


// // SIGN UP LOGIC
app.post("/register", function(req,res){
  const {name,OpCo,username,psw} = req.body;
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
  var newUser = new model({name:name,OpCo:OpCo,username:username,password:psw});
    model.register(newUser, req.body.password, function(err,user){
      if (err) {
        console.log(err.message)
        return res.render("register");  
      } 
        passport.authenticate("local")(req,res,function(){
        res.redirect("/home");
        })
    });
});

// HANDLING  LOGIN LOGIC
app.post('/login', (req, res, next) => {
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
  passport.use(new LocalStrategy(model.authenticate()));
  passport.serializeUser(model.serializeUser());
passport.deserializeUser(model.deserializeUser());
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect("/login");
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/home');
    });

  })(req, res, next);
});

var getUser

app.get("/home",middlewareObj.isLoggedIn,function(req,res){
  getUser=req.user.username
  res.render("home")
})

// app.post("/form",middlewareObj.isLoggedIn, function(req,res){
//   const {name,value,segment,to} = req.body;
//   var newLead = new Lead({name:name,time:new Date(),status:"open",value:value,segment:segment,Submitted_By:req.user.username,Submitted_To:to});
//   newLead.save()
//   console.log("Lead Generated")
//   res.redirect(`/home`)
// });

app.get("/leads",middlewareObj.isLoggedIn,async function(req,res){
  var allLeads= await lead.find({Submitted_To:req.user.username})
  res.render("leads",{allLeads:allLeads});
});

app.get("/leadSent",middlewareObj.isLoggedIn,async function(req,res){
  var allLeads= await lead.find({Submitted_By:req.user.username})
  res.render("leadSent",{allLeads:allLeads});
});

app.get("/form",middlewareObj.isLoggedIn,function(req,res){
  console.log(req.user)
  res.render("form",{username:req.user.username});
});
const data = [ 
  {to: 'prapti@opco1.com', from: 'juhi@opco2.com', status: 'Validated'},
  {to: 'rohan@opco1.com', from: 'atharva@opco2.com', status: 'Closed'},
  {to: 'abc@opco1.com', from: 'xyz@opco2.com', status: 'Validated'}
]
app.get("/home/csv",middlewareObj.isLoggedIn,async function(req,res){
  const query = lead.find({Submitted_By:req.user.username},{_id:0,Submitted_By:1,Submitted_To:1,curstatus:1})
  let list = await query.lean().exec();
  const query1 = lead.find({Submitted_To:req.user.username},{_id:0,Submitted_By:1,Submitted_To:1,curstatus:1})
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


var allUsers = new  Map;
io.on('connection', (socket) => {
  allUsers.set(getUser, socket.id);
  socket.on('LeadSent', (leadobj) => {
    console.log(allUsers)
     console.log("Someone sent Lead : " + leadobj.data);
     var newLead = new Lead({name:leadobj.name,status:{label:"open",time:new Date()},curstatus:"open",value:leadobj.value,segment:leadobj.segment,Submitted_By:leadobj.from,Submitted_To:leadobj.to});
     newLead.save()
     console.log("Lead Generated")
    var  Receiver_Email = leadobj.to;
    console.log(leadobj)
    var ID =  allUsers.get(Receiver_Email);
    console.log(Receiver_Email +" "+ ID)
     if(ID != undefined){
       socket.broadcast.to(ID).emit('LeadReceived');
      }
     else{
       // generate a notification array
        console.log("User not found")
     }
  });
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

app.get("/leads/open",middlewareObj.isLoggedIn,async function(req,res){
  var allLeads= await lead.find({Submitted_To:req.user.username})
  var openLeads=allLeads.filter(x => x.curstatus==="open")
  res.render("leads",{allLeads:openLeads});
});
app.get("/leads/closed",middlewareObj.isLoggedIn,async function(req,res){
  var allLeads= await lead.find({Submitted_To:req.user.username})
  var closeLeads=allLeads.filter(x => x.curstatus==="close")
  res.render("leads",{allLeads:closeLeads});
});
app.get("/leads/validated",middlewareObj.isLoggedIn,async function(req,res){
  var allLeads= await lead.find({Submitted_To:req.user.username})
  var validatedLeads=allLeads.filter(x => x.curstatus==="validated")
  res.render("leads",{allLeads:validatedLeads});
});
app.get("/leads/rejected",middlewareObj.isLoggedIn,async function(req,res){
  var allLeads= await lead.find({Submitted_To:req.user.username})
  var rejectedLeads=allLeads.filter(x => x.curstatus==="rejected")
  res.render("leads",{allLeads:rejectedLeads});
});

app.post("/leads/:id/reject",middleware.isLoggedIn, function(req, res){
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

app.post("/leads/:id/accept",middleware.isLoggedIn, function(req, res){
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

app.post("/leads/:id/close",middleware.isLoggedIn, function(req, res){
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

http.listen(process.env.PORT || 80, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  })
