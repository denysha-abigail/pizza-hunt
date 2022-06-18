const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

// mongoose.connect() tells mongoose which database we want to connect to; if the environment variable MONGODB_URI exists, like on Heroku, it will use that
// otherwise, it will short-circuit to the local MongoDB server's database at mongodb://localhost:27017/pizza-hunt
// if mongoose connects to a database that isn't there, MongoDB will find and connect to the database if it exists or create the database if it doesn't
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-hunt', {
    // set of configuration options Mongoose asks for more information about
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// logs mongo queries being executed
mongoose.set('debug', true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
