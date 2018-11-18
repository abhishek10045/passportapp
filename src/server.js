const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);

const User = require('./models/user');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/app';

const app = express();

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser : true,
        useCreateIndex : true
    })
    .then(() => console.log('db connected'))
    .catch(err => console.log(err));

const db = mongoose.connection;

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(cookieParser('please keep this a secret'));

app.use(session({
    secret : 'please keep this a secret',
    resave : false,
    saveUninitialized : false,
    store : new MongoStore({mongooseConnection : db}) 
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

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

routes(app);

app.listen(PORT, () => console.log('app started'));
