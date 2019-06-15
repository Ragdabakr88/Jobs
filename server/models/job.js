const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


const jobSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref:'user'},
        title:{type:String , 
              min:[4, 'Too long,min is 4 chracters'],
              max:[32, 'Too long,max is 32 chracters'],
            },
        tag:{type:String ,default:""},
        type:{type:String ,default:""},
        createdAt: { type: Date, default: Date.now },
        expireDate: { type: Date},
        category:{type:String ,default:""},
        description:{type:String ,
             min:[10, 'Too long,min is 10 chracters'],
             max:[1000, 'Too long,max is 1000 chracters'],},
        address:{type:String ,default:""},
        Max:{type:Number ,default:""},
        Min:{type:Number ,default:""},
        email:{type:String ,default:""},
        jobApplicants:[{
           userId: { type: Schema.Types.ObjectId, ref: 'User' },
           email:{type:String,default:''},
           phone:{type:String,default:''},
           name:{type:String,default:''},
           cvVersion:{type:String},
           cvId:{type:String},
           created:{type:Date ,default:Date.now()},
         }],
       
   });
   
   


module.exports = Job= mongoose.model('Job', jobSchema);