// in the ReplySchema, we'll need a unique identifier of the default _id field that is created, so we'll add a custom replyId field; despite the custom field name, we're still going to have it generate the same type of ObjectId() value that the _id field typically does, but we'll have to import that type of data first -> Types
const { Schema, model, Types } = require('mongoose');
// import dateFormat() function
const dateFormat = require('../utils/dateFormat');

// create replies as a subdocument array for comments
const ReplySchema = new Schema(
    {
        // set custom id to avoid confusion with parent comment_id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String
        },
        writtenBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // use toJSON and add getters to all timestamp-related fields
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);


const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // use toJSON and add getters to all timestamp-related fields
        get: createdAtVal => dateFormat(createdAtVal)
    },
    // associate replies with comments
    // unlike the relationship between pizza and comment data, replies will be nested directly in a comment's document and not referred to
    // use ReplySchema to validate data for a reply
    replies: [ReplySchema]
},
    {
        toJSON: {
            // add a virtual to get the total reply count; we'll use this to combine the reply count with the comment count so that users can get a full picture of the discussion around a pizza
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// create replyCount virtual
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;