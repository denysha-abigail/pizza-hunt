const { Pizza } = require('../models');

// CRUD methods for the /api/pzzas endpoint routes
const pizzaController = {
    // functions will go here as methods

    // create a method for finding all pizza data
    // get all pizzas
    // will serve as the callback function for the GET /api/pizzas route
    getAllPizza(req, res) {
        // uses the mongoose .find() method (similar to how Sequelize uses the .findAll() method)
        Pizza.find({})
            // populate a field by passing in an object with the key path plus the value of the field you want populated
            .populate({
                path: 'comments',
                // tells mongoose that we don't care about the __v field on comments; the - in front indicates that we don't want it to be returned; if we didn't have it, it would mean that it would return ONLY the __v field
                select: '-__v'
            })
            // doesn't include the pizza's __v field when data is returned
            .select('-__v')
            // sorts data so that the newest pizza returns first; .sort({ _id: -1 }) sorts in DESC order by _id value
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // create a method for finding a specific pizza by its _id value
    // get one pizza by id
    // instead of accessing the entire req, we've destructured params out of it, because that's the only data needed for this request to be fulfilled 
    getPizzaById({ params }, res) {
        // uses the mongoose .findOne() method to find a single pizza by its _id
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            // no need for the .sort() method here because we'd only be sorting a single pizza!
            .then(dbPizzaData => {
                // if no pizza is found, send 404
                if (!dbPizzaData) {
                    //  if we can't find a pizza with that _id, we can check whether the returning value is empty and send a 404 status back to alert users that it doesn't exist
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // create a method for handling POST /api/pizzas to add a pizza to the database
    // create a pizza
    // we destructure the body out of the Express.js req object because we don't need to interface with any of the other data it provides
    // in MongoDB, the methods for adding data to a collection are .insertOne() or .insertMany(); in mongoose, we use the .create() method, which will handle either one or multiple inserts
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            // sends a 400 error back if something goes wrong, as we likely sent the wrong type of data for one of the fields
            .catch(err => res.status(400).json(err));
    },

    // create a method for updating a pizza when we make a request to PUT /api/pizzas/:id
    // update pizza by id
    updatePizza({ params, body }, res) {
        // with the .findOneAndUpdate() method, mongoose finds a single document we want to update, then updates it and returns the updated document
        // if the third parameter { new: true } is not set, it will return the original document; by setting it to true, we're instructing mongoose to return the new version of the document
        // methods called .updateOne() and .updateMany() update documents without returning them
        // runValidators: true is included when updating data so that it knows to validate any new information
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },

    // create a method for deleting a pizza when we make a request to DELETE /api/pizzas/:id
    // delete a pizza
    deletePizza({ params }, res) {
        // will find the document to be returned and also delete it from the database
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }

};

// tip: when setting up a file, create the data you'll be exporting and then immediately write the export command
module.exports = pizzaController;