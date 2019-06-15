const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username:{
    type: String,
    min:[4, 'Too long,min is 4 chracters'],
    max:[32, 'Too long,max is 32 chracters'],
   
  },
  email:{ 
    type: String,
    min:[4, 'Too long,min is 4 chracters'],
    max:[32, 'Too long,max is 32 chracters'],
    unique : true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password:{ 
    type: String,
    min:[4, 'Too long,min is 4 chracters'],
    max:[32, 'Too long,max is 32 chracters'],
  },
 
  role: {
    type: String,
    required:true
  },
   google:{
     email:String,
     token:String,
     id:String,
     displayName:String
  },
  isVerified: { type: Boolean, default: false },
 
  resetPasswordToken:String,
  resetPasswordExpires:Date,

  comments:[{
  comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  }],

  employeerSettings:{type: Schema.Types.ObjectId, ref: 'EmployeerSettings'},
  freelancerSettings:{type: Schema.Types.ObjectId, ref: 'Settings'},

  posts:[{
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  }],
  following:[{
  username:{type:String ,default:""},
  }],  userFollowed: { type: Schema.Types.ObjectId, ref: 'User' },

  followers:[{
  username:{type:String ,default:""},
  follower: { type: Schema.Types.ObjectId, ref: 'User' },
  }],
 
  notifications:[{
  message:{type:String ,default:""},
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  viewProfile:{type:Boolean,default :false},
  created:{type:Date ,default:Date.now()},
  read :{type:Boolean,default :false},
  date:{type:String,default:''},

 }],
 

 notifiyJobs:[{
  user:{type:String ,default:""},
  job:{type:String ,default:""},
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  created:{type:Date ,default:Date.now()},
 }],


 posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
 jobs:  [{ type: Schema.Types.ObjectId, ref: 'Job' }],

 bookmarks:[{
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  jobTitle:{type:String,default:''},
  jobAddress:{type:String,default:''},
  jobType:{type:String,default:''},
  createdAt:{type:Date ,default:Date.now()},
  }],

 status: { type: String, default: 'follow'},


chatList:[{
  reciever: { type: Schema.Types.ObjectId, ref: 'User' },
  msg: { type: Schema.Types.ObjectId, ref: 'Message' },
  read :{type:Boolean,default :false},
 }],

 applayforJobs:[{
  foundJob: { type: Schema.Types.ObjectId, ref: 'Job' },
 }],



});

//comparing correct password
//--------------------------



userSchema.methods.hasSamePassword = function(requestedPassword) {
  return bcrypt.compareSync(requestedPassword, this.password);
 
}

//hashing password after saving user in db
//------------------------------------------

userSchema.pre('save',function(next){

  const user = this;

bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
    });
  });

});

module.exports = User= mongoose.model('User', userSchema);