const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    sender:{type:String ,default:""},
    reciever:{type:String ,default:""},
     messages:[{
            senderId: { type: Schema.Types.ObjectId, ref: 'User' },
            recieverId: { type: Schema.Types.ObjectId, ref: 'User' },
            body:{type:String ,default:""},
            createdAt: { type: Date, default: Date.now },
            isRead :{type:Boolean,default :false},
            sender:{type:String ,default:""},
           reciever:{type:String ,default:""},
        }]
    
});

module.exports = Message = mongoose.model('Message',messageSchema);

