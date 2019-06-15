const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


const applayJobSchema = new Schema({

          user: { type: Schema.Types.ObjectId, ref: 'User' },
          name:{type:String ,default:""},
          email:{type:String},
          phone:{type:String},
          created:{type:Date ,default:Date.now()},
          read :{type:Boolean,default :false},
          cvVersion:{type:String},
          cvId:{type:String},
          isApplayed:{type:Boolean,default :false},
    
       
   });
   
   


module.exports = ApplayJob = mongoose.model('ApplayJobSchema', applayJobSchema);