const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Token = require('../models/token');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
var nodemailer = require('nodemailer');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
const SMTP = require('nodemailer-smtp-transport');
const { authMiddleware } = require('../helpers/auth');
const Joi = require('joi');

// ---------------- Confirmation email---------------- 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: "intecable@gmail.com",
      pass: "regorego2"
  }
});
var rand,mailOptions,host,link;



// ---------------- Find sregister route---------------- 

router.post('/register',function(req,res){
const {username ,email ,password ,passwordConfirmation,role} = req.body;
  console.log(username ,email ,password ,passwordConfirmation,role);


 //check if data send
  if(!email || !password){
   return res.status(422).send({errors:[{title:'Data missing', detail:'الايميل وكلمه المرور مطلوبين'}]});
     
  }
//check if password === pssword confirmation
  if (password !== passwordConfirmation) {
    return res.status(422).send({errors: [{title: 'Invalid passsword!', detail: 'كلمه المرور غير متطابقه'}]});
  }

  if (!role) {
    return res.status(422).send({errors: [{title: 'Error', detail:' يجب اختيار نوع الحساب اما صاحب عمل او باحث عن عمل '}]});
  }


// check if user is found {email:email}
   User.findOne({email},async function(err, existingUser) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (existingUser) {
      return res.status(422).send({errors: [{title: 'Invalid email!', detail: 'الايميل مسجل من قبل'}]});
    }

    console.log(existingUser);
  
    const user = new User({
      username,
      email,
      password,
      role
    });

    console.log('u',user);
    user.save(function(err){
      if (err){
        // return res.status(422).send({errors: normalizeErrors(err.errors)});
        console.log(err);
      }
       console.log('userId',user.email);
 
       rand=Math.floor((Math.random() * 100) + 54);
       host=req.get('host');
       link="http://"+req.get('host')+"/api/v1/users/verify?id="+rand;
       mailOptions={
           to : user.email,
           secure: false, 
           tls: {
            rejectUnauthorized: false
             },
           subject : "Jobgate,Please confirm your Email account",
           html : "Hello, Please Click on the link to verify your email .<a href="+link+">Click here to verify your account in Jobgate</a>" 
       }
       console.log(mailOptions);
       smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
               console.log('eroooor',error);
           res.end("error");
        }else{
               console.log("Message sent: " + response.message);
           res.end("sent");
            }
       });
      
            return res.json({"registered":true});
         
     });
   });
});

// ---------------- Verify confirmation email---------------- 
router.get('/verify',function(req,res){
  console.log(req.protocol+":/"+req.get('host'));
  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {

      console.log("Domain is matched. Information is from Authentic email");
      if(req.query.id==rand)
      {  
        res.redirect(`http://localhost:4200/login`);
        res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
        // User.findOne({email:mailOptions.to}, function (err, user) {
        //   console.log('verfies',user);
        //   // Verify and save the user
        //   user.isVerified = true;
        //   user.save(function (err) {
        //       if (err) { return res.status(500).send({ msg: err.message }); }
        //         res.status(200).send("The account has been verified. Please log in.");
        //       console.log("email is verified");
        //       console.log(user);
            
        //   }); 
        // });
      }

      else
      {
          console.log("email is not verified");
          res.end("<h1>Bad Request</h1>");
      }

 
    }

  });

// ---------------- Find auth route ---------------- 


router.post('/auth',function(req,res){
  const { email, password } = req.body;

if (!password || !email) {
  return res.status(422).send({errors: [{title: 'Data missing!', detail: 'الايميل وكلمه المرور مطلوبين'}]});
}

User.findOne({email}, function(err, user) {
  if (err) {
    return res.status(422).send({errors: normalizeErrors(err.errors)});
  }

  if (!user) {
    return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'المستخدم غير موجود'}]});
  }

  if (user.hasSamePassword(password)) {
    const token = jwt.sign({
      userId: user.id,
      email: user.email
    }, config.SECRET, { expiresIn: '1h'});
    return res.json(token);
    
  } else {
    return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'الايميل او كلمه المرور غير صحيحين'}]});
  }
});


});
// ----------------  Find user profile by id ---------------- 

router.get('/:id',function(req,res){
const requestedUserId = req.params.id;
    User.findById(requestedUserId)
    .populate('chatList.reciever')
    .populate('chatList.msg')
    .populate('chatList.read')
    .populate('posts')
    .populate('jobs')
    .exec(function(err,foundUser){
    if(err){
   return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    console.log('found',foundUser);
    res.json(foundUser);
  });
});

// ----------------  Find all users ----------------

router.get("/",function(req,res){
  User.find({}).populate("comments").populate("posts").populate('chatList').exec(function(err,users){
    if(err){
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    res.json(users);
  });
});

// ----------------  Delete User ----------------

router.delete("/:id",authMiddleware, function(req,res){
  User.findOne({_id:req.params.id},function(err,user){
    if(err){
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    user.remove(function(err){
      if(err){
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    return res.json("deleted client");
  });
 });
});

// ----------------  Update User ----------------

router.patch("/:id",authMiddleware,function(req,res){
  User.findOne({_id:req.params.id},function(err,user){
    if(err){
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save(function(err,foundUser){
      if (err) {
       return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
     return res.json(foundUser);
    });
  });
});

// ----------------  Forget Password ----------------


router.post('/forgot',function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'لا يوجد حساب باسم هذا الايميل'}]});
          // return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({       
        service: 'Gmail',
        auth: {
          user: 'intecable@gmail.com', // generated ethereal user
          pass: 'regorego2' 
        },
        tls:{
          rejectUnauthorized:false
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'intecable@gmail.com',
        subject: 'Job gate Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/api/v1/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };


      smtpTransport.sendMail(mailOptions, function(err) {
        // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.json(err);
    
  });
});

// ----------------  reset get page Password ----------------
router.get('/reset/:token', function(req, res) {
  tokenId = req.params.token;
  console.log(tokenId);
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'لا يوجد حساب بهذا الايميل'}]});
     
    }
    res.redirect(`http://localhost:4200/reset/${tokenId}`);
  });
});


// ----------------  reset post page Password ----------------


router.post('/reset/:token', function(req, res) {
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;
  const token = req.params.token;
  console.log('pass',password);
  console.log('passc',passwordConfirmation);
  console.log('token',token);
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
      
          return res.redirect('back');
        }
        console.log('u',user);
        // if(req.body.password === req.body.passwordConfirmation) {
        
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.password = password;
            console.log('up',user.password);
            user.save(function(err) {
              console.log('u',user);
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
            // }
          });
    
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
                auth: {
                  user: 'intecable@gmail.com', // generated ethereal user
                  pass: 'regorego2' 
                },
                tls:{
                  rejectUnauthorized:false
                }
      });
      var mailOptions = {
        to: user.email,
        from: 'learntocodeinfo@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/http://localhost:4200/login');
  });
});

module.exports = router;