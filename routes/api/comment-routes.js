const router = require('express').Router();
// import methods from the controller
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
// addComment -> POST callback
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>
// removeComment -> DELETE callback
// we need two parameters to delete a comment because after deleting a comment, we need to know exactly which pizza that comment originated from
router
    .route('/:pizzaId/:commentId')
    // the callback function of a route method has req and res as parameters so no need to explicitly pass any arguments to addReply
    .put(addReply)
    .delete(removeComment);

// /api/comments/<pizzaId>/<commentId>/<replyId>
// removeReply -> DELETE callback
// need the id of the individual reply not just its parent
router
    // trying to model the routes in a RESTful manner, so as best practice, we should include the ids of the parent resources in the endpoint
    // "go to this pizza, then look at this particular comment, then delete this one reply"
    .route('/:pizzaId/:commentId/:replyId')
    .delete(removeReply);

module.exports = router;