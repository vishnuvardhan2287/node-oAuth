const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const MongoStore  = require('connect-mongo')(session);


//load config
dotenv.config({path : './config/config.env'});

//passport config
require('./config/passport')(passport);

connectDB();

const app = express();

//Body Parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

// Morgan middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//handlebar helper
const {formatDate, stripTags, truncate, editIcon,select} = require('./helpers/hbs');

//handlebars
app.engine('.hbs', exphbs({helpers:{formatDate, stripTags, truncate, editIcon,select},defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
  })

//static folder
app.use(express.static(path.join(__dirname ,'public')));

//routes
app.use('/',require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories',require('./routes/stories'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))