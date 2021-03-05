var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    OpCo1 = require("../models/opco1");
    OpCo2 = require("../models/opco2");
    OpCo3 = require("../models/opco3");


router.get("/register", function(req,res){
  res.render("register");
});

router.get("/index", function(req,res){
  res.render("index");
});


router.get("/login", function(req, res){
  res.render("login");
})

router.get("/", function(req, res){
  res.render("login");
})


// LOGOUT ROUTE
router.get("/logout", function(req, res){
  req.logout();

  res.redirect("/login");
})


module.exports = router;