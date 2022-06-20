const router = require('express').Router();
// instead of importing the entire object and having to do pizzaController.getAllPizza(), we destructure the method names out of the imported object and use those names directly
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');

// instead of creating duplicate routes for the individual HTTP methods, we can combine them --> router.route('/').get(getCallbackFunction).post(postCallbackFunction); = 
// router.get('/', getCallbackFunction);
// router.post('/' postCallbackFunction);

// set up GET all and POST at /api/pizzas
router
    .route('/')
    // see how we simply provide the name of the controller method as the callback; that's why we set up those methods to accept req and res as parameters
    .get(getAllPizza)
    .post(createPizza);

// set up GET one, PUT, and DELETE at /api/pizzas/:id
router
    .route('/:id')
    .get(getPizzaById)
    .put(updatePizza)
    .delete(deletePizza);

module.exports = router;