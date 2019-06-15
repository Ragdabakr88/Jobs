const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    //   participants:[{
    //         senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    //         recieverId: { type: Schema.Types.ObjectId, ref: 'User' },
    //     }]
      
            senderId: { type: Schema.Types.ObjectId, ref: 'User' },
            recieverId: { type: Schema.Types.ObjectId, ref: 'User' },
   
    
});

module.exports = Conversation = mongoose.model('Conversation',conversationSchema);

