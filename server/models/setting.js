const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
     user: { type: Schema.Types.ObjectId, ref: 'User' },
     firstName:{
        type: String,
        min:[4, 'Too long,min is 4 chracters'],
        max:[32, 'Too long,max is 32 chracters'],
      },
     lastName:{
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
     tel:{type: String,default:""},
     perHour:{type: String,default:""},
     skills:[{skill:{type:String ,default:""}, }],
     nationality:{type: String,default:""},
     jobTile:{type: String,default:""},
     des:{type:String ,default:""},
     picVersion:{type:String,default: '1555401575'},
     picId:{type:String,default: 'images.png'},
     cvVersion:{type:String},
     cvId:{type:String},
     isFreelancer: { type: Boolean, default: false },
});

module.exports = Setting = mongoose.model('Setting',settingSchema);


