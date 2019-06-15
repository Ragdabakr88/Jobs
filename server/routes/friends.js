const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const { authMiddleware } = require('../helpers/auth');
const Joi = require('joi');
const async = require('async');



// ---------------- Follow- user --------------- 

router.post("/follow" ,authMiddleware , function(req,res){

   userId = req.body.userId;
   user = res.locals.user;
   const follower = user.id;
   const userFollowed = userId;
   const username = user.username;
  //  console.log("followername",username);
  //  console.log("follower",follower);
  //  console.log("who is followed",userId);

   User.findOne({_id:userId},async function(err,foundUser){
    if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

    // await foundUser.followers.push(follower);
    await foundUser.followers.push({
           follower:follower,
           username:username
      });

      await foundUser.notifications.push({
        message:`${username} is following you`,
        senderId:follower,
        viewProfile:false,
        created:Date.now()
         });  
      foundUser.save();
    //   foundUser.update({_id: userId}, { status: 'following'}, function(){});
      return  res.json(foundUser);
      });

   User.findOne({_id:user.id}, async function(err,foundUser){
    if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
     await  foundUser.following.push({userFollowed:userFollowed,username:username});
      foundUser.save();
      return  res.json(foundUser);
   });
});

// ---------------- Mark read notifications --------------- 

router.post("/mark/:notifyId" ,authMiddleware , function(req,res){
   
  notifyId = req.params.notifyId;
  user = res.locals.user;
  const userId = user.id;
  User.update({_id:userId ,'notifications._id':notifyId}, { $set:{'notifications.$.read':true}}, function(){}); 
  return  res.json(user);
});

// ---------------- Delete notifications --------------- 

router.post("/delete/:notifyId" ,authMiddleware , function(req,res){
  
  notifyId = req.params.notifyId;
  user = res.locals.user;
  const userId = user.id;
  User.findOne({_id:userId},async function(err,foundUser){
  if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    await foundUser.notifications.pull({
      _id:notifyId,
       });  
     foundUser.save();
    return res.json(foundUser);
    });
  });

  // ---------------- Mark All read notifications --------------- 

router.post("/markAll" ,authMiddleware , function(req,res){
  user = res.locals.user;
  const userId = user.id;
  User.update({_id:userId }, 
    { $set:{'notifications.$[elem].read':true}}, 
    {arrayFilters:[{'elem.read':false }], multi:true},
    function(){}); 
  return  res.json("marked all");
  });

   module.exports = router;


