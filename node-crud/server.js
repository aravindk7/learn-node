const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { handleError } = require('./app/helpers/error');

const app = express();

//set sessions and cookie Parser
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    cookie: {maxAge: 60000},
    resave: false, //forces the session to be saved back to the store
    saveUninitialized: false //don't save unmodified session
}));
app.use(flash());

//confiure express for staic assets
app.use(express.static(path.join(__dirname, '/public')));

//set ejs as templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

//middleware to log HTTP
app.use(morgan('dev'));

//use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }));

//set the routes
app.use(require('./app/routes'));

mongoose.connect(process.env.DB_URI, 
    {useUnifiedTopology: true, useNewUrlParser: true, createIndexes: true});

mongoose.connection.on("error", err => {
    console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
});

app.use((err, req, res, next) => {
    handleError(err, res);
});

const port = process.env.PORT || 8080;

app.listen(port, ()=> {
    console.log(`App listening on http://localhost://${port}`);
});
