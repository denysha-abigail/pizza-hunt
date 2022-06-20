// like in Sequelize, a file is created in the models directory that will package up all of the models

// import models here to package them up
const Pizza = require('./Pizza');
const Comment = require('./Comment');

module.exports = { Pizza, Comment };