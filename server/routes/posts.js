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



// ---------------- Add Post---------------- 

router.post("/createPost" ,authMiddleware ,function(req,res){
   const user = res.locals.user;
   const {post} = req.body;

   const newPost = new Post({post});
   newPost.user = user;
   newPost.createdAt = Date.now();
   newPost.user.username = user.username;


   Post.create(newPost ,function(err,newPost){
    if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
  
      User.update({_id: user.id}, { $push: {posts: newPost}}, function(){});
  
      return res.json(newPost);
   })
})

// ---------------- Find All Posts---------------- 

router.get("/allPosts" ,function(req,res){
   Post.find({}).populate("user").exec(function(err,posts){
    if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
      return res.json(posts);
   });
});

// ---------------- Add likes to post---------------- 
router.post("/add-like" ,authMiddleware, function(req,res){
   const user = res.locals.user;
   const postId = req.body._id; // fron posts in angular
   Post.update({_id: postId}, { $push:{likes: user}}, function(){}); 
   Post.update({_id: postId}, { $inc:{totalLikes: +1}}, function(){}); 
   
   res.json("liked post");

});

// ---------------- Add comments to post---------------- 


router.post("/add-comment" ,authMiddleware ,function(req,res){
   const user = res.locals.user;
   console.log(user);
   const {comment} = req.body;
   const username = user.username;
   const userId = user.userId;
   const postId = req.body.postId // from posts in angular
   Post.findOne({ _id:req.body.postId },function(err,foundPost){
      if (err) {
         return res.status(422).send({errors: normalizeErrors(err.errors)});
       }
       console.log(foundPost);
      foundPost.comments.push(comment);
      foundPost.save((err) =>{
         if (err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)});
          }

          Post.update({_id: postId}, { $push:{comments: username}}, function(){}); 
         return  res.json(foundPost);
      }) ;
     });
   });







// ---------------- Find single post---------------- 

router.get('/:id',function(req,res){
   Post.findOne({ _id:req.params.id }).exec(function(err,foundPost){
      if(err){
         res.json("foundPost not found");
      }else{
        res.json(foundPost);
      }
    });
  });
 

   

   module.exports = router;


