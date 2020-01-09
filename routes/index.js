const express = require("express");
const router = express.Router();
const user = require("../models/user");
const passport = require("passport");
const middleware = require("../middleware");
const FroalaEditor = require('../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');
const aws = require('aws-sdk');
const pjson = require('../package.json');
const slugify = require("slugify");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const session = require('express-session');
const crypt = require('bcrypt-nodejs');
const async = require('async');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const xoauth2 = require('xoauth2');
const jsonfile = require('jsonfile')


// Category JSON
const siteMap = './json/site-map.json';
var JSONcategories;

jsonfile.readFile(siteMap, function (err, obj) {
    if (obj) {
        JSONcategories = obj;
    }
});

// Environment
const host = process.env.HOST;
const port = process.env.PORT;
const email_user = process.env.EMAIL_USER; // Nodemailer Email
const email_password = process.env.EMAIL_PASSWORD; // Nodemailer

function firstname(req) {
    if (req.user.username) {
        var firstname = req.user.username.substr(0, req.user.username.indexOf('.'))
        return firstname;
    }
}

// ROOT
router.get("/", middleware.isLoggedIn, function(req, res) {
    res.render("index", {
        version: pjson.version,
        admin: false,
        user: req.user,
        firstname: (firstname(req))
    });
});

// REGISTER ROUTES
router.get("/arx", function(req, res) {
    res.render("arx", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-native", function(req, res) {
    res.render("./arx/arx-onboard-native", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-am", function(req, res) {
    res.render("./arx/arx-onboard-am", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-native-check", function(req, res) {
    res.render("./arx/arx-onboard-native-check", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-am-check", function(req, res) {
    res.render("./arx/arx-onboard-am-check", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-native-customer-check", function(req, res) {
    res.render("./arx/arx-onboard-native-customer-check", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-am-customer-found", function(req, res) {
    res.render("./arx/arx-onboard-am-customer-found", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-am-customer-check", function(req, res) {
    res.render("./arx/arx-onboard-am-customer-check", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-campaign-builder", function(req, res) {
    res.render("./arx/arx-onboard-campaign-builder", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-campaign-package", function(req, res) {
    res.render("./arx/arx-onboard-campaign-package", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-campaign-targeting", function(req, res) {
    res.render("./arx/arx-onboard-campaign-targeting", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-signing", function(req, res) {
    res.render("./arx/arx-onboard-signing", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-onboard-preview", function(req, res) {
    res.render("./arx/arx-onboard-preview", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.get("/arx-complete", function(req, res) {
    res.render("./arx/arx-complete", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

// REGISTER ROUTES
router.get("/register", function(req, res) {
    res.render("register", {
        version: pjson.version,
        admin: false,
        user: req.user
    });
});

router.post("/register", function(req, res, next) {

    var newUser = new user({
        username: req.body.username,
        password: req.body.password
    });

    user.findOne({
        username: req.body.username
    }, function(err, user) {
        
        if (err) return done(err);
        
        if (user) {
            req.flash("error", req.body.username + " already exists");
            return res.redirect('/register');
        }

        else {
            newUser.save(function(err) {
                req.logIn(newUser, function(err) {
                    req.flash("success", "Welcome " + newUser.username);
                    res.redirect('/')
                });
            });
        }        
    }); 

});

// LOGIN ROUTES
router.get("/login", function(req, res) {
    res.render("login", {
        user: req.user,
        version: pjson.version,
        admin: false
    });
});

router.get("/verify/:user", function(req, res, next) {

    async.waterfall([
        function(done) {
            user.findOne({
                username: req.params.user
            }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/login');
                }
                else {
                    req.logIn(user, function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                            req.flash('success', 'Welcome ' + user.username);
                            return res.redirect('/');
                        }
                    });
                }
            });
        }
    ], function(err, done) {
        if (err) {} else {
            res.redirect('/');
            done();
        }

    });
});

// router.post('/login', function(req, res, next) {
    // passport.authenticate('local', {
    //     failureFlash: true
    // }, function(err, user, info) {
    //     if (err) return next(err)
    //     if (!user) {
    //         req.flash("error", info.message);
    //         return res.redirect('/login');
    //     }
    //     req.logIn(user, function(err) {
    //         if (err) return next(err);
    //         req.flash("success", 'Welcome back ' + user.username);
    //         return res.redirect('/');
    //     });
    // })(req, res, next);
// });

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have been logged out.");
    res.redirect("/");
});

// FORGOT PASSWORD ROUTES
router.get("/forgot", function(req, res) {
    res.render("forgot", {
        version: pjson.version,
        admin: false,
        user: req.user,
    });
});

router.post('/forgot', function(req, res, next) {

    async.waterfall([
        function(done) {
            user.findOne({
                username: req.body.username
            }, function(err, user) {
                if (user == null) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/login');
                }
                else if (user === null) {
                    console.log('catch');
                }
                else {
                    done(err,user);
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: email_user,
                    pass: email_password
                }
            });
            var mailOptions = {
                to: user.username,
                from: 'hello@kaiserbear.co.uk',
                subject: 'Zoopla UX: Password Reset.',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/verify/' + user.username + '\n\n' +
                    'If you did not request this, please contact Zoopla ARX team.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    done();
                }
            });
        }
    ], function(err, done) {
        if (err) {} else {
            req.flash('success', 'Success, please check your email.');
            res.redirect('/login');
            done();
        }

    });
});



module.exports = router;