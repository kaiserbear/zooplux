// import package
const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require('bcrypt-nodejs');


/* For now this can be minimum, but will probably need to change post MVP to include an image, and departments. */

// create a User schema
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: String
});


userSchema.pre('save', function(next) {
    
    var user = this;
    var SALT_FACTOR = 5;


    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {

        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



// userSchema.plugin(passportLocalMongoose); // adding method to user

// export the model
module.exports = mongoose.model("User", userSchema);