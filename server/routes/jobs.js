const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Job = require('../models/job');
const ApplayJob = require('../models/applayJob');
const Comment = require('../models/comment');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const { authMiddleware } = require('../helpers/auth');
const Joi = require('joi');
const async = require('async');
const unirest = require('unirest');
const Setting = require('../models/setting');
const EmployeerSetting = require('../models/employeerSetting');
const cloudinary = require('cloudinary');

// ---------------- Add Post---------------- 

cloudinary.config({ 
    cloud_name: 'dnf8ntdmr', 
    api_key: '563934858817624', 
    api_secret: 'jdWteSWvkd_CUuf4Dd7GO3lFYUc' 
  });


// ---------------- Add New Job ---------------- 

router.post("/createJob" ,authMiddleware ,function(req,res){
   const user = res.locals.user;
   console.log("user",user);
   const {title,Max,Min,category,type,description,address,tag,expireDate,email} = req.body;
  //  console.log("job",title,Max,Min,category,type,description,address,tag,expireDate,email);

   const newJob = new Job({title,Max,Min,category,type,description,address,tag,expireDate,email});
   newJob.user = user;
   newJob.createdAt = Date.now();
   newJob.user.username = user.username;

   console.log('1',newJob);

   Job.create(newJob ,function(err,newJob){
    if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      console.log(newJob);
  
      User.update({_id: user.id}, { $push: {jobs: newJob}}, function(){});
  
      return res.json(newJob);
   })
})

// ---------------- Find All Jobs---------------- 

router.get("/allJobs" ,function(req,res){
   Job.find({}).exec(function(err,jobs){
    if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
      // console.log('jobsss',jobs);
      return res.json(jobs);
   });
});


 // ---------------- Find Search Jobs---------------- 


router.get('/',function(req,res){

   const title = req.query.title;
   const address = req.query.address;
   const type = req.query.type;

   const query = {
    title:title,
    address:address,
    type:type,
     // title:title.toLowerCase()
   };


   Job.find(query)     
   .exec(function(err,foundJobs){

       if(err){
      return res.status(422).send({errors: normalizeErrors(err.errors)});
        } 

       if(foundJobs.length === 0){
         return  res.status(422).send({errors:[{title:'Job Error', detail:'لا توجد وظيفه مطابقه لهذا البحث'}]});
       }
       console.log(foundJobs);
       return  res.json(foundJobs);

  });

});
   
// ---------------- Bookmarks --------------- 

router.post("/bookmarks/:jobId" ,authMiddleware , function(req,res){
   jobId = req.params.jobId;
   userId = req.body.userId;
   user = res.locals.user;
   jobTitle = req.body.data.title;
   jobAddress = req.body.data.address;
   jobType = req.body.data.type;
    console.log(user);
   User.findOne({_id:user.id}, async function(err,foundUser){
      if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
       await  foundUser.bookmarks.push({
          jobId:jobId,
          jobTitle:jobTitle,
          jobAddress:jobAddress,
          jobType:jobType,
          createdAt:Date.now(),
         });
        foundUser.save();
        return  res.json(foundUser);
     });
   });

 // ---------------- Delete bookmark job ---------------- 

 router.post("/delete/:jobId" ,authMiddleware , function(req,res){
   jobId = req.params.jobId;
   user = res.locals.user;
   const userId = user.id;
   User.findOne({_id:userId},async function(err,foundUser){
   if (err) {
       return res.status(422).send({errors: normalizeErrors(err.errors)});
     }
     await foundUser.bookmarks.pull({
       _id:jobId,
        });  
      foundUser.save();
     return res.json(foundUser);
     });
   });

    // ---------------- Find job By Id ----------------

    router.get('/singleJob/:jobId', function(req,res){
      const jobId = req.params.jobId;
       Job.findById(jobId)
          .exec(function(err,foundJob){
          if(err){
         return res.status(422).send({errors: normalizeErrors(err.errors)});
          }
          // console.log('foundJob',foundJob);
          res.json(foundJob);
        });
      });
 
      // ----------------  Find job user by id ---------------- 

router.get('/jobOwner/:userId',function(req,res){
  const userId = req.params.userId;
  console.log('userId', userId);
      User.findById(userId)
      .populate('chatList.reciever')
      .populate('chatList.msg')
      .populate('chatList.read')
      .populate('posts')
      .populate('jobs')
      .exec(function(err,foundUser){
      if(err){
     return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
      // console.log('employee profile user found',foundUser);
      res.json(foundUser);
    });
  });

// ---------------- Get employeer Profile by id ---------------- 

router.get('/jobOwenerProfile/:employeerSettingId', function(req,res){
  const requestedProfileId = req.params.employeerSettingId;
  // console.log('requestedProfileId' , requestedProfileId)
  EmployeerSetting.findById(requestedProfileId)
      .exec(function(err,foundEmployeerProfile){
      if(err){
     return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
      // console.log('foundEmployeerProfile',foundEmployeerProfile);
      res.json(foundEmployeerProfile);
    });
  });

  // ---------------- Applay for  Job ---------------- 

router.post("/applayJob/:jobId" ,authMiddleware ,function(req,res){

   var cv = req.body.cv;
   var user = res.locals.user;
   var jobId = req.params.jobId;

   cloudinary.uploader.upload(cv,async (result) => {
    const cvVersion = result.version;
    const cvId  =  result.public_id;

 
   if (!req.body.settings.name) {
    return res.status(422).send({errors: [{title: 'الاسم مطلوب', detail: 'حقل الاسم مطلوب'}]});
  }
  if (!req.body.settings.phone) {
    return res.status(422).send({errors: [{title: 'رقم الجوال مطلوب', detail: 'حقل الجوال مطلوب'}]});
  }
  if (!req.body.settings.email) {
    return res.status(422).send({errors: [{title: 'الايميل مطلوب', detail: 'حقل الايميل مطلوب'}]});
  }

  
      Job.findOne({_id:jobId}, async function(err,foundJob){
        if (err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)});
          }
          
          await foundJob.jobApplicants.push({
          userId:user.id,
           name:req.body.settings.name,
           email:req.body.settings.email,
           phone:req.body.settings.phone,
           cvId:cvId,
           cvVersion:cvVersion,
           created:Date.now(),
           });
        
          foundJob.save();
          console.log('foundJob',foundJob);
          

        User.findOne({_id:user.id}, async function(err,foundUser){
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        await foundUser.notifiyJobs.push({
          user:user.username,
          jobId:foundJob.id,
          job:foundJob.title,
          created:Date.now(),
           });

        await foundUser.applayforJobs.push(foundJob);
        foundUser.save();

        console.log('foundUser',foundUser);
        return  res.json(foundJob);
      });
    });
  });
 });



  // ---------------- Delete applay for  job ---------------- 

  router.post("/deleteApplay/:applayId" ,authMiddleware , function(req,res){
    applayId = req.params.applayId;
    jobId = req.body.jobId;
    user = res.locals.user;
    const userId = user.id;
    Job.findOne({_id:jobId},async function(err,foundJob){
    if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
          await foundJob.jobApplicants.pull({
        _id:applayId,
         });  
       foundJob.save();
       console.log(foundJob);
      return res.json(foundJob);
      });
    });

 
  // ---------------- Delete my job from manage jobs ---------------- 

  router.post("/deleteMyJob/:myJobId" ,authMiddleware , function(req,res){
    myJobId = req.params.myJobId;
    jobId = req.body.jobId;
    user = res.locals.user;
    const userId = user.id;
    Job.findOne({_id:jobId},async function(err,foundJob){
    if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
          await foundJob.jobApplicants.pull({
        _id:myJobId,
         });  
       foundJob.save();
       console.log(foundJob);
      return res.json(foundJob);
      });
    });
   module.exports = router;


