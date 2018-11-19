const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);
const hbs = require('hbs');

const User = require('./models/user');
const routes = require('./routes');

const MONGODB_URI = 'mongodb://localhost:27017/app';

const app = express();

app.set('port', process.env.PORT || 3000);

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser : true,
        useCreateIndex : true
    })
    .then(() => console.log('db connected'))
    .catch(err => console.log(err));

const db = mongoose.connection;

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.use('/static', express.static(path.join(__dirname, '/../node_modules/jquery/dist')));
app.use('/static', express.static(path.join(__dirname, '/../node_modules/bootstrap/dist')));


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

app.listen(app.get('port'), () => console.log('app started'));
