const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
// addComment -> POST callback
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>
// removeComment -> DELETE callback
// we need two parameters to delete a comment because after deleting a comment, we need to know exactly which pizza that comment originated from
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;