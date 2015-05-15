/**
 * Created by jan on 15.05.15.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var app = express(); //Create the Express app

//connect to our database
//Ideally you will obtain DB details from a config file
var dbName = 'abirechner';
var opts = {
    user: "admin",
    pass: "admin"
};
var connectionString = 'mongodb://localhost:27017/' + dbName;

var connection = mongoose.connect(connectionString);
autoIncrement.initialize(connection);
//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var studienplaene = require('./routes/studienplaene'); //routes are defined here
app.use('/api', studienplaene); //This is our route middleware

module.exports = app;