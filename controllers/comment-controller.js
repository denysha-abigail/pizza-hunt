// import models we need
const { Comment, Pizza } = require('../models');

// create commentController object
const commentController = {
    // create a method to add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    // $push method adds the comment's _id to the specific pizza we want to update; it adds data to an array like in javascript
                    { $push: { comments: _id } },
                    // receive back the updated pizza (the pizza with the new comment included)
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // with new replies, we aren't actually creating a reply document; we're simply updating an existing comment
    // as with addComment() and removeComment(), we're passing params as a parameter which we will pass into addReply() when implemented in the route
    addReply({ params, body }, res) {
        Comment.findByIdAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true }
        )
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // create a method to remove comment from pizza
    removeComment({ params }, res) {
        // deletes the document while also returning its data
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' });
                }
                // we then take that data and use it to identify and remove it from the associated pizza using the $pull operation
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                // lastly, we return the updated pizza data, now without the _id of the comment in the comments array, and return it to the user
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // remove a reply
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            // using the $pull operator to remove a specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err));
    }
};

module.exports = commentController;