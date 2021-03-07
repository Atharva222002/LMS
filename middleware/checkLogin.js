var jwt = require('jsonwebtoken');

var requireAuth = (req, res, next) => {
  var token = localStorage.getItem("tocken");

  // check json web token exists & is verified
  if (token) {
    next()
    ;
  } else {
    res.send('You Need To Login first for this .')
  }
};

module.exports =  requireAuth ;