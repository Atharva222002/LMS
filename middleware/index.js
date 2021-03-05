const opco1 = require("../models/opco1");
const opco2 = require("../models/opco2");
const opco3 = require("../models/opco3");
var middlewareObj = {};

// LOGIN MIDDLEWARE
middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
   return next();
}
 
res.redirect("/login");
}

middlewareObj.authComp = function(OpCo){
  return(req,res,next)=>{
  if(req.user.OpCp!==OpCo){
    res.status(401)
    return res.send("Not allowed")
  }
  next()
}
}

module.exports = middlewareObj;