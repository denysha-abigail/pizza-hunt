// although we could import the entire mongoose library, we only need to worry about the Scema constructor and model function
const { Schema, model } = require('mongoose');

// data to be stored when users create a new pizza: the name of the pizza, the name of the user that created the pizza, a timestamp of when the pizza was created, a timestamp of any updates to the pizza's data, the pizza's suggested size, and the pizza's toppings

const PizzaSchema = new Schema({
    // define fields with specific data types
    pizzaName: {
        // no need to use special imported data types for the type definition; we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        // if no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    // indicates an array as the data type; you could also specify Array in place of the brackets
    toppings: []
});

// create the Pizza model using the PizzaSchhema to get the prebuilt methods that Mongoose provides and export it
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;