const router = require('express').Router();

// instead of creating duplicate routes for the individual HTTP methods, we can combine them --> router.route('/').get(getCallbackFunction).post(postCallbackFunction); = 
// router.get('/', getCallbackFunction);
// router.post('/' postCallbackFunction);

// set up GET all and POST at /api/pizzas
router
    .route('/')
    .get()
    .post();

// set up GET one, PUT, and DELETE at /api/pizzas/:id
router
    .route('/:id')
    .get()
    .put()
    .delete();

module.exports = router;