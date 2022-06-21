// although we could import the entire mongoose library, we only need to worry about the Scema constructor and model function
const { Schema, model } = require('mongoose');
// import dateFormat function that doesn't exist on this file
const dateFormat = require('../utils/dateFormat');

// data to be stored when users create a new pizza: the name of the pizza, the name of the user that created the pizza, a timestamp of when the pizza was created, a timestamp of any updates to the pizza's data, the pizza's suggested size, and the pizza's toppings

const PizzaSchema = new Schema({
    // define fields with specific data types
    pizzaName: {
        // no need to use special imported data types for the type definition; we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on
        type: String,
        // with the mongoose's required field, you can actually provide a custome error message instead of the generic required message 
        required: 'You need to provide a pizza name!',
        // removes white space before and after the input string
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        // if no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp
        default: Date.now,
        // getters: a special type of function that takes the stored data you are looking to retrieve and modifies or formats it upon return; middleware for your data!
        // transforms the data by default every time it's queried; now, every time we retrieve a pizza, the value in the createdAt field will be formaatted by the dateFormat() function and used instead of the default timestamp value
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        default: 'Large'
    },
    // indicates an array as the data type; you could also specify Array in place of the brackets
    toppings: [],
    // connect pizza table with comments table
    // in mongoose, we can instruct the parent to keep track of its children, not the other way around like in sequelize where we would have to store a reference of the parent data's id with the child data
    comments: [
        {
            // we need to tell mongoose to expect an ObjectId and tell it that its data comes from the Comment model
            type: Schema.Types.ObjectId,
            // the ref property tells the Pizza model which documents to search to find the right comments
            ref: 'Comment'
        }
    ]
},
    {
        // we need to tell the schema that it can use virtuals by adding the toJSON property to the schema options
        toJSON: {
            virtuals: true,
            // tells the mongoose model that it should use any getter function we've specified
            getters: true
        },
        // we set id to false because this is a virtual that mongoose returns, and we don't need it
        id: false
    }
);

// virtuals allow you to add virtual properties to a document that aren't stored in the database; usually computed values that get evaluated when you try to access their properties
// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    // updated from this.comments.length to include all replies as well; here, we use the .reduce() method to tally up the total of every comment with its replies
    // in its basic form, the .reduce() takes two parameters -> an accumulator and a currentValue; here, the accumulator is total and the currentValue is comment
    // as .reduce() walks through the array, it passes the accumulating tool and the current value of comment into the function, with the return of the function revising the total for the next iteration through the array
    // like .map(), the array prototype method .reduce() executes a function on each element in an array; unlike .map(), the .reduce() uses the result of each function execution for each successive computation as it goes through the array; this makes it a perfect candidate for getting a sum of multiple values
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchhema to get the prebuilt methods that Mongoose provides and export it
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;