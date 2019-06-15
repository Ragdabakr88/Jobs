const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Setting = require('../models/setting');
const EmployeerSetting = require('../models/employeerSetting');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const { authMiddleware } = require('../helpers/auth');
const Joi = require('joi');
const async = require('async');
const cloudinary = require('cloudinary');

// ---------------- Add Post---------------- 

cloudinary.config({ 
    cloud_name: 'dnf8ntdmr', 
    api_key: '563934858817624', 
    api_secret: 'jdWteSWvkd_CUuf4Dd7GO3lFYUc' 
  });
 

// ---------------- Add Freelancer Settings---------------- 

router.post("/createSetting" ,authMiddleware ,function(req,res){
   var image = req.body.image;
   var user = res.locals.user;
   var cv = req.body.cv;
   var slider = req.body.slider;
   var skill = req.body.skillList;

    cloudinary.uploader.upload(image,async (result) => {
     const picVersion = result.version;
     const picId  =  result.public_id;
 
    cloudinary.uploader.upload(cv,async (resultCv) => {
     const cvVersion = resultCv.version;
     const cvId =  resultCv.public_id;
  
    const body = {
 
        firstName : req.body.settings.firstName,
        lastName: req.body.settings.lastName,
        email : req.body.settings.email,
        tel : req.body.settings.tel,
        perHour : req.body.slider,
        nationality : req.body.settings.nationality,
        jobTile : req.body.settings.jobTile,
        des: req.body.settings.des,
        picVersion:picVersion ,
        picId :picId ,
        cvVersion:cvVersion,
        cvId:cvId,
        
     }

     
   if (!req.body.settings.firstName) {
    return res.status(422).send({errors: [{title: 'الاسم مطلوب', detail: 'حقل الاسم مطلوب'}]});
  }
  if (!req.body.settings.lastName) {
    return res.status(422).send({errors: [{title: 'العنوان مطلوب', detail: 'حقل العنوان مطلوب'}]});
  }
  if (!req.body.settings.email) {
    return res.status(422).send({errors: [{title: 'الايميل مطلوب', detail: 'حقل الايميل مطلوب'}]});
  }
  if (!req.body.settings.tel) {
    return res.status(422).send({errors: [{title: 'الهاتف مطلوب', detail: 'حقل الهاتف مطلوب'}]});
  }
  if (!req.body.settings.des) {
    return res.status(422).send({errors: [{title: 'الوصف مطلوب', detail: 'حقل الوصف مطلوب'}]});
  }
  if (!req.body.settings.nationality) {
    return res.status(422).send({errors: [{title: 'الهاتف مطلوب', detail: 'حقل الجنسيه مطلوب'}]});
  }
  // if (!req.body.settings.skills) {
  //   return res.status(422).send({errors: [{title: 'الوصف مطلوب', detail: 'حقل المهارات مطلوب'}]});
  // }
  
  if (!req.body.settings.jobTile) {
    return res.status(422).send({errors: [{title: 'الهاتف مطلوب', detail: 'حقل المسمي الوظيفي مطلوب'}]});
  }

     const newSettings = new Setting();
     newSettings.user = user;
     newSettings.isFreelancer = true;
     newSettings.firstName = req.body.settings.firstName;
     newSettings.lastName =req.body.settings.lastName;
     newSettings.email = req.body.settings.email;
     newSettings.tel = req.body.settings.tel;
     newSettings.des = req.body.settings.des;
     newSettings.picVersion = picVersion;
     newSettings.picId = picId;
     newSettings.cvVersion = cvVersion;
     newSettings.cvId = cvId;
     newSettings.skills = skill.skill;
     newSettings.nationality =  req.body.settings.nationality;
     newSettings.jobTile =  req.body.settings.jobTile;
     newSettings.perHour = slider;
     newSettings.save(function(err,newSettings){
       if(err){
         console.log(err);
       }
      User.findOne({_id:user.id}, async function(err,foundUser){
        if (err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)});
          }
          // console.log('foundUser1',foundUser);
          foundUser.freelancerSettings = newSettings;
          foundUser.save();
          // console.log('foundUser22',foundUser);
          return  res.json(foundUser);
        });
      });
    });
  });
});

// ---------------- Get freelancerProfile by id ---------------- 

router.get('/:freelancerSettingId', function(req,res){ 
  const requestedProfileId = req.params.freelancerSettingId;
  // console.log( 'freelancerSettingId22',requestedProfileId);
        Setting.findById(requestedProfileId)
           .populate('freelancerSettings')
          .exec(function(err,freelancerProfile){
          if(err){
          return res.status(422).send({errors: normalizeErrors(err.errors)});
          }
      // console.log('foundfreelancerProfilekk',freelancerProfile);
    
      res.json(freelancerProfile);
    });
  });



// ---------------- Add Employeer Settings---------------- 

router.post("/createEmployeerSetting" ,authMiddleware ,function(req,res){
  var image = req.body.image;
  var user = res.locals.user;

   cloudinary.uploader.upload(image,async (result) => {
    const picVersion = result.version;
    const picId  =  result.public_id;

 
   if (!req.body.settings.firstName) {
    return res.status(422).send({errors: [{title: 'الاسم مطلوب', detail: 'حقل الاسم مطلوب'}]});
  }
  if (!req.body.settings.lastName) {
    return res.status(422).send({errors: [{title: 'العنوان مطلوب', detail: 'حقل العنوان مطلوب'}]});
  }
  if (!req.body.settings.email) {
    return res.status(422).send({errors: [{title: 'الايميل مطلوب', detail: 'حقل الايميل مطلوب'}]});
  }
  if (!req.body.settings.tel) {
    return res.status(422).send({errors: [{title: 'الهاتف مطلوب', detail: 'حقل الهاتف مطلوب'}]});
  }
  if (!req.body.settings.description) {
    return res.status(422).send({errors: [{title: 'الوصف مطلوب', detail: 'حقل الوصف مطلوب'}]});
  }
       
    const newSettings = new EmployeerSetting();
    newSettings.user = user;
    newSettings.isEmployee = true;
    newSettings.firstName = req.body.settings.firstName;
    newSettings.lastName =req.body.settings.lastName;
    newSettings.email = req.body.settings.email;
    newSettings.tel = req.body.settings.tel;
    newSettings.description = req.body.settings.description;
    newSettings.picVersion = picVersion;
    newSettings.picId = picId;
    newSettings.save(function(err,newSettings){
      if(err){
        console.log(err);
      }
      console.log('n',newSettings);
        User.findOne({_id:user.id}, async function(err,foundUser){
      if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        foundUser.employeerSettings = newSettings;
        foundUser.save();
        console.log('foundUser222',foundUser);
        return  res.json(foundUser);
      });
    });
  });
});

// ---------------- Get employeer Profile by id ---------------- 

router.get('/:employeerSettingId', function(req,res){
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
  
// ---------------- Update employeerSetting by Id ---------------- 

router.patch('/:settingId', authMiddleware, function(req, res) {
  var user = res.locals.user;
  var id = req.params.settingId;
  var image = req.body.selectedFile;

  EmployeerSetting.findOne({_id:id}, function (err,employeerSetting){
     if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    cloudinary.uploader.upload(image,async (result) => {
      const picVersion = result.version;
      const picId  =  result.public_id;
    
    if (!req.body.setting.firstName) {
      return res.status(422).send({errors: [{title: 'الاسم مطلوب', detail: 'حقل الاسم مطلوب'}]});
    }
    if (!req.body.setting.lastName) {
      return res.status(422).send({errors: [{title: 'العنوان مطلوب', detail: 'حقل العنوان مطلوب'}]});
    }
    if (!req.body.setting.email) {
      return res.status(422).send({errors: [{title: 'الايميل مطلوب', detail: 'حقل الايميل مطلوب'}]});
    }
    if (!req.body.setting.tel) {
      return res.status(422).send({errors: [{title: 'الهاتف مطلوب', detail: 'حقل الهاتف مطلوب'}]});
    }
    if (!req.body.setting.description) {
      return res.status(422).send({errors: [{title: 'الوصف مطلوب', detail: 'حقل الوصف مطلوب'}]});
    }
  
     
    employeerSetting.user = user;
    employeerSetting.isEmployeer = true;
    employeerSetting.firstName = req.body.setting.firstName;
    employeerSetting.lastName =req.body.setting.lastName;
    employeerSetting.email = req.body.setting.email;
    employeerSetting.tel = req.body.setting.tel;
    employeerSetting.description = req.body.setting.description;
    employeerSetting.picVersion = picVersion;
    employeerSetting.picId = picId;
    employeerSetting.save(function(err,employeerSetting){
         if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
       }
        return res.json(employeerSetting);
      });
    });
  });
});

// ---------------- Get freelancer Profile by id ---------------- 

router.get('/:freelancerSettingId', function(req,res){
  const requestedProfileId = req.params.freelancerSettingId;
   Setting.findById(requestedProfileId)
      .exec(function(err,foundFreelancerProfile){
      if(err){
     return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
      // console.log('foundFreelancerProfile',foundFreelancerProfile);
      res.json(foundFreelancerProfile);
    });
  });
// ---------------- Update Freelancer Setting by Id ---------------- 

router.patch('/freelanserEdit/:settingId', authMiddleware, function(req, res) {
  var user = res.locals.user;
  var id = req.params.settingId;
  var image = req.body.selectedFile;
  var user = res.locals.user;
  var cv = req.body.cv;
  var slider = req.body.slider;
  var skill = req.body.skillList;

  EmployeerSetting.findOne({_id:id}, function (err,employeerSetting){
     if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

 

    cloudinary.uploader.upload(image,async (result) => {
     const picVersion = result.version;
     const picId  =  result.public_id;
 
    cloudinary.uploader.upload(cv,async (resultCv) => {
     const cvVersion = resultCv.version;
     const cvId =  resultCv.public_id;
    
    if (!req.body.setting.firstName) {
      return res.status(422).send({errors: [{title: 'الاسم مطلوب', detail: 'حقل الاسم مطلوب'}]});
    }
    if (!req.body.setting.lastName) {
      return res.status(422).send({errors: [{title: 'العنوان مطلوب', detail: 'حقل العنوان مطلوب'}]});
    }
    if (!req.body.setting.email) {
      return res.status(422).send({errors: [{title: 'الايميل مطلوب', detail: 'حقل الايميل مطلوب'}]});
    }
    if (!req.body.setting.tel) {
      return res.status(422).send({errors: [{title: 'الهاتف مطلوب', detail: 'حقل الهاتف مطلوب'}]});
    }
    if (!req.body.setting.description) {
      return res.status(422).send({errors: [{title: 'الوصف مطلوب', detail: 'حقل الوصف مطلوب'}]});
    }
  
     
    Setting.user = user;
    Setting.firstName = req.body.setting.firstName;
    Setting.lastName =req.body.setting.lastName;
    Setting.email = req.body.setting.email;
    Setting.tel = req.body.setting.tel;
    Setting.des = req.body.setting.des;
    Setting.nationality = req.body.setting.nationality;
    Setting.perHour = req.body.setting.jobTile;
    Setting.nationality = req.body.setting.nationality;
    Setting.picVersion = picVersion;
    Setting.picId = picId;
    Setting.cvVersion = cvVersion;
    Setting.cvId = cvId;
    Settings.skills = skill.skill;
    Settings.perHour = slider;
    Setting.save(function(err,freelancerEditingSetting){
         if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
       }
        return res.json(freelancerEditingSetting);
      });
    });
  });
 });
});


module.exports = router;
