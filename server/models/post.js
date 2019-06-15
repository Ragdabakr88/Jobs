const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
     user: { type: Schema.Types.ObjectId, ref: 'User' },
     post:{type:String ,default:""},
     createdAt: { type: Date, default: Date.now },
     totalLikes:{type:Number ,default:0},
     likes:[{
            username:{type:String ,default:""},
            user: { type: Schema.Types.ObjectId, ref: 'User' },
        }],
      comments:[{
            username:{type:String ,default:""},
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment:{type:String ,default:""},
            createdAt: { type: Date, default: Date.now }
            // comment: { type: Schema.Types.ObjectId, ref: 'Comment' },

        }]
    
});


module.exports = Post = mongoose.model('Post',postSchema);


