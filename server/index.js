const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const config = require("./config/db");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require("cors");
const passport = require('passport');
const google = require('./config/passport-google');
const nodemailer = require('nodemailer');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const async = require('async');
const crypto = require('crypto');
const logger = require('morgan');
const _ = require('lodash');
const cloudinary = require('cloudinary');



// const methodOverride = require("method-override");

const app = express(); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit:'300mb' }));
app.use(morgan('dev') );
app.use(cookieParser());
app.use(logger('dev'));
app.use(cors());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: config.SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

//socket 
var http = require('http').Server(app);
var io = require('socket.io')(http);

const {User} = require('./helpers/UserClass');

//call streams file
require('./socket/streams')(io,User,_);
require('./socket/private')(io);

// mongoose connect
mongoose.connect(config.mongoDbUrl ,{ useNewUrlParser: true } )
.then( 
	() =>{
       // const fakeDb = new FakeDb();
       // // fakeDb.seeDb();
	});

app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/posts', require('./routes/posts'));
app.use('/api/v1/friends', require('./routes/friends'));
app.use('/api/v1/message', require('./routes/message'));
app.use('/api/v1/image', require('./routes/image'));
app.use('/api/v1/jobs', require('./routes/jobs'));
app.use('/api/v1/settings', require('./routes/settings'));




const PORT = process.env.PORT || 3001;
http.listen(PORT,function(){
	console.log("running 3001");
});