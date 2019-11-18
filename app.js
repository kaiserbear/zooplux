const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const pjson = require('./package.json');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const sass = require('node-sass');
const dotenv = require('dotenv').config();
const User = require("./models/user");
const url = process.env.DATABASEURL;
const port = process.env.PORT;
const ip = process.env.IP;
const nodemailer = require('nodemailer');
const session = require('express-session');
const crypt = require('bcrypt-nodejs');
const async = require('async');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) return done(err);
    if (!user) {
      return done(null, false, { message: 'Sorry, we don\'t recognise that email address' });
    }
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Sorry, that password is incorrect.' });
      }
    });
  });
}));

mongoose.Promise = global.Promise;

mongoose.connection.openUri(url)
  .once('open', () => console.log('Good to go!'))
  .on('error', (error) => {
    console.warn('Warning', error);
  });

app.use(bodyParser.urlencoded({
    extended: true
}));


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "UX Noths!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

var indexRoutes = require("./routes/index");
app.use("/", indexRoutes);


// Error Handling
app.get('*', wrapAsync(async function(req, res) {
  await new Promise(resolve => setTimeout(() => resolve(), 50));
  // Async error!
  throw new Error('Sorry, this page can\'t be found.');
}));

app.use(function(error, req, res, next) {
  // Gets called because of `wrapAsync()`
  // res.json({ message: error.message });
  res.render("error",{
      message: error.message,
      admin: false,
      version: pjson.version
  });
});

function wrapAsync(fn) {
  return function(req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
}


app.listen(port, function() {
    // console.log("Kindred Guidelines Server Has Started!");
    // a console.log() which triggers Nodemon's "stdout" event 
    console.log('UX Noths server listening on port ' + port);
});