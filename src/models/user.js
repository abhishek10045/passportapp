const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
});

userSchema.methods.register = function () {
        bcrypt
            .hash(this.password, 10)
            .then(hash => {
                this.password = hash;
                return this.save();
            })
            .then(() => console.log('user registered'))
            .catch(err => console.log(err));
};

userSchema.statics.findUser = function (username, password, done) {
        this
            .findOne({username})
            .then(user => {
                if (!user)
                    return done(null, false);
                user
                    .validPassword(password)
                    .then(valid => {
                        if (!valid)
                            return done(null, false);
                        return done(null, user);
                    })
                    .catch(err => done(err));
            })
            .catch(err => done(err));
};


userSchema.methods.validPassword = function (password) {
        return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
