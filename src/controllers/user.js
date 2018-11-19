const User = require('../models/user');

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/user/login');
};

module.exports.loginForm = (req, res) => {
    res.render('login', {
        user : req.user
    });
};

module.exports.registrationForm = (req, res) => {
    if (!req.user)
        res.send('REGISTRATION FORM');
    res.send(req.user);    
};

module.exports.registerUser = (req, res) => {
    const {name, username, email, password} = req.body;
    const user = new User({
        name,
        username,
        email,
        password
    });
    user.register();
    res.redirect('/user/login');
};