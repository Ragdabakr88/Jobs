const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const { authMiddleware } = require('../helpers/auth');
const Joi = require('joi');
const async = require('async');

// ---------------- Create Message ---------------- 


router.post("/chat/:senderId/:recieverId" ,authMiddleware ,function(req,res){
    const user = res.locals.user;
    const recieverId = req.body.recieverId;
    const senderId = req.body.senderId;
    const message = req.body.message;
    const reciverName = req.body.recieverName;
    // console.log(reciverName);
    const senderName = user.username;


    
    //check if there is previous conversation or not 

    Conversation.find({ $or:[
         {'senderId':senderId,'recieverId':recieverId },
         {'senderId':recieverId,'recieverId':senderId },
        ]},async function(err,conversation){
        if (err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)});
          }
        //   console.log('conversation',conversation);

          if(conversation.length > 0){

            // console.log('conversation',conversation[0].id);
             const conv = conversation[0].id;

           Message.findOne({conversation:conv},async function(err,foundMessage){
                if (err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)});
                  }
                // console.log('foundMessage1',foundMessage); 
                await foundMessage.messages.push({
                    sender : senderName,
                    reciever : reciverName,   
                    senderId : senderId,
                    recieverId : recieverId,
                    isRead:false,
                    body : message,
                    created : Date.now(),
                 });
                 foundMessage.save();
                //  console.log('foundMessage2',foundMessage);
               });

          }else{

         const newConversation = new Conversation();
         newConversation.senderId = senderId;
         newConversation.recieverId = recieverId;
         newConversation.save();
        
         console.log('newConversation',newConversation);
      
        
        

        const newMessage = new Message();
        newMessage.conversation = newConversation._id;
        newMessage.sender = senderName;
        newMessage.reciever = reciverName;
        newMessage.messages.push({
           sender : senderName,
           reciever : reciverName,   
           senderId : senderId,
           recieverId : recieverId,
           isRead:false,
           body : message,
           created : Date.now(),
        });
        newMessage.save();
        console.log('newMessage',newMessage);
      

        //for sender
        User.findOne({_id:senderId}, async function(err,foundUser){
            if (err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)});
              }
             await  foundUser.chatList.push(
                 {reciever:recieverId,msg:newMessage._id});
              foundUser.save();
            //   console.log('sender',foundUser);
           });

         //for reciever
        User.findOne({_id:recieverId}, async function(err,foundUser){
            if (err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)});
              }
             await  foundUser.chatList.push(
                 {reciever:senderId,msg:newMessage._id});
              foundUser.save();
            //   console.log('reciever',foundUser);
           });


          return res.json(foundMessage);
        }
   
    });
 });


// ---------------- Get all chat messages ---------------- 

 router.get("/chatMsg/:senderId/:recieverId",authMiddleware ,function(req,res){
    const user = res.locals.user;
    const recieverId = req.params.recieverId ;
    const senderId = req.params.senderId;
   
    console.log("recieverId",recieverId);
    console.log("senderId",senderId);

    Conversation.findOne({ $or:
        [
          {
           $and:[
               {'senderId':senderId},
              {'recieverId':recieverId },
           ]
        },
        {
           $and:[
              {'senderId':recieverId},
              {'recieverId':senderId },
            ]
         }
       ]
     }, function(err,conversation){
       if (err) {
           return res.status(422).send({errors: normalizeErrors(err.errors)});
         }
         
        
         if(conversation){
            const conv = conversation._id;
            Message.findOne({conversation:conv}, function(err,foundMessage){
                if (err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)});
                  }
                  // console.log(foundMessage);
                  return res.json(foundMessage);
            });
         }
    });
 });

 // ---------------- Delete chat list  notification  when click on it---------------- 

router.post("/delete/:notifyId" ,authMiddleware , function(req,res){
  
  notifyId = req.params.notifyId;
  user = res.locals.user;
  const userId = user.id;
  User.findOne({_id:userId},async function(err,foundUser){
  if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    await foundUser.chatList.pull({
      _id:notifyId,
       });  
     foundUser.save();
    return res.json(foundUser);
    });
  });

module.exports = router;


