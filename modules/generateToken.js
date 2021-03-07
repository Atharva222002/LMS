var jwt = require('jsonwebtoken')

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


var createToken = (id) => {
    localStorage.setItem("tocken",id)
    return localStorage.getItem("tocken")
};

module.exports = createToken;