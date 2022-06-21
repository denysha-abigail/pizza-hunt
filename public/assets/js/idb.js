// create variable to hold db connection

// here, we create a variable db that will store the connected database object when the connection is complete
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// here, we create the request variable to act as an event listener for the database; the event listener is created when we open the connection to the database using the indexedDB.open() method
// as part of the browser's window object, indexedDB is a global variable; we could say window.indexedDB, but there is no need
// the .open() method takes in two parameters: the name of the indexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist) -> pizza_hunt & the version of the database; by default we start it at 1; used to determine whether the database's structure has changed between connections
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
// this listener will handle the event of a change that needs to be made to the database's structure
// the onupgradeneeded event will emit the first time we run this code and create the new_pizza object store; the event will not run again unless we delete the database from the browser or we change the version number in the .open() method to a value of 2, indivating that our database needs an update
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store (table) called 'new_pizza' and set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful
// we set it up so that when we finalize the connection to the database, we can store the resulting database object to the global variable db we created earlier
// this event will also emit every time we interact with the database, so every time it runs we check to see if the app is connected to the internet network; if so, we'll execute the uploadPizza() function
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradeneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        // we haven't created this yet, but we will soon, so let's comment it out for now
        uploadPizza();
    }
};

// onerror event handler to inform us if anything ever goes wrong with the database interaction
request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// with indexedDB, we don't always have a direct connection like in SQL or MongoDB databases; thus, CRUD operations are available at all times; instead, we have to explicitly open a transaction (or temporary connection to the database); this will help the indexedDB database maintain an accurate reading of the data it stores so that data isn't in flux all the time

// this function will be executed if we attempt to submit a new pizza and there's no internet connection
// this function will be used in the add-pizza.js file's form submission function if the fetch() function's .catch() method is executed --> remember, the fetch() function's .catch() method is only executed on network failure
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new pizza'
    // once we open that transaction, we directly access the new_pizza object store, because this is where we'll be adding data
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    // we use the object store's .add() method to insert data into the new_pizza object store
    pizzaObjectStore.add(record);
};

// here, we're opening a new transaction to the database to read the data; then we access the object store for new_pizza and execute the .getAll() method to it
function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
    // the getAll.onsuccess event will execute after the .getAll() method completes successfully
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverRespose => {
                if (serverRespose.message) {
                    throw new Error(serverRespose);
                }
                // open on more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');

                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');

                // clear all items in your store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}

// listen for app coming back online
// here, we instruct the app to listen for the broswer regaining internet connection using the online event
// if the browser comes back online, we execute the uploadPizza() function automatically
window.addEventListener('online', uploadPizza);