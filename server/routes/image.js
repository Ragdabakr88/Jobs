const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const { authMiddleware } = require('../helpers/auth');
const cloudinary = require('cloudinary');

// ---------------- Add Post---------------- 

cloudinary.config({ 
   cloud_name: 'dnf8ntdmr', 
   api_key: '563934858817624', 
   api_secret: 'jdWteSWvkd_CUuf4Dd7GO3lFYUc' 
 });

// ---------------- Upload images--------------- 

 router.post("/upload-image" ,authMiddleware , function(req,res){
   const user = res.locals.user;
   const userId = user.id;
cloudinary.uploader.upload(req.body.image,async (result) => {
   console.log('result' , result);
   User.findOne({_id:userId},async function(err,foundUser){
      if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
      //   console.log(foundUser);
      await foundUser.images.push({
             imgId:result.public_id,
             imgVersion:result.version
        });
        foundUser.save();
      //   console.log(foundUser);
        return  res.json(foundUser);
      }); 
    });
 });


 // ---------------- Set profile pic---------------- 

   router.get("/setProfile/:imageVersion/:imageId" ,authMiddleware , function(req,res){
      const user = res.locals.user;
      const imageVersion = req.params.imageVersion;
      const imageId = req.params.imageId;
      console.log(imageVersion,imageId);
      
      //  User.update({_id: user.id},{picVersion:imageVersion,picId:imageId} ,function(){});
       User.update({_id: user.id},{ $set:{'picVersion':imageVersion,'picId':imageId }},function(){});
    });
   module.exports = router;


