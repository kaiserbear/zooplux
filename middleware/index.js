const jsonfile = require('jsonfile');
const file = './json/site-map.json';;

// all the middleare goes here
var middlewareObj = {};

middlewareObj.test = function(req, res, next) {
    console.log(req);
    return next();
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to view this content");
    res.redirect("/login");
}

module.exports = middlewareObj;