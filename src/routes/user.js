const userRouter = require('express').Router();
const passport = require('passport');
const userController = require('../controllers/user');

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