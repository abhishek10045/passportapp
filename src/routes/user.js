const userRouter = require('express').Router();
const passport = require('passport');
const userController = require('../controllers/user');

const Strategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new Strategy((username, password, done) => {
    User.findUser(username, password, done);
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    User
        .findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

userRouter
    .route('/login')
    .get(userController.loginForm)
    .post(passport.authenticate('local', {
        successRedirect : '/user/login',
        failureRedirect : '/user/login'
    }));

userRouter
    .route('/logout')
    .get(userController.logout);

userRouter
    .route('/register')
    .get(userController.registrationForm)
    .post(userController.registerUser);

module.exports = userRouter;