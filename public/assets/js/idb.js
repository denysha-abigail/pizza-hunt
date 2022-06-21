// create variable to hold db connection
// here, we create a variable db that will store the connected database object when the connection is complete
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// here, we create the request variable to act as an event listener for the database; the event listener is created when we open the connection to the database using the indexedDB.open() method
// as part of the browser's window object, indexedDB is a global variable; we could say window.indexedDB, but there is no need
// the .open() method takes in two parameters: the name of the indexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist) -> pizza_hunt & the version of the database; by default we start it at 1; used to determine whether the database's structure has changed between connections
const request = indexedDB.open('pizza_hunt', 1);

