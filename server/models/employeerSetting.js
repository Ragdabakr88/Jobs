
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeerSettingsSchema = new Schema({
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
     description:{type:String ,default:""},
     picVersion:{type:String,default: '1557182348'},
     picId:{type:String,default: 'xx.jpg'},
     isEmployeer: { type: Boolean, default: false },
    
});

module.exports = EmployeerSetting = mongoose.model('EmployeerSetting',employeerSettingsSchema);

