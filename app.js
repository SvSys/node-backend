/**
 * Created by jan on 15.05.15.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var studienplaene = require('./routes/studienplaene'); //routes are defined here
var app = express(); //Create the Express app

//connect to our database
//Ideally you will obtain DB details from a config file
var dbName = 'abirechner';
var opts = {
    user: "admin",
    pass: "Lnvhzr3PA4uq"
};
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString), opts;

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', studienplaene); //This is our route middleware

module.exports = app;