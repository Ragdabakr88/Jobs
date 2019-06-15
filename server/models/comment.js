const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
        
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        comment:{type:String},
        createdAt: { type: Date, default: Date.now },
        // post: { type: Schema.Types.ObjectId, ref: 'Post' },

});

module.exports = Comment = mongoose.model('Comment',commentSchema);
