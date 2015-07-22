/**
 * Created by jan on 15.05.15.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var cors = require('cors');

var app = express(); //Create the Express app

//connect to our database
//Ideally you will obtain DB details from a config file
var dbName = 'abirechner';
var host = process.env.OPENSHIFT_MONGODB_DB_HOST || "127.0.0.1";
var port = process.env.OPENSHIFT_MONGODB_DB_PORT || "27017";
var username = process.env.OPENSHIFT_MONGODB_DB_USERNAME || "";
var password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || "";
var opts = {
    user: username,
    pass: password
};
var connectionString = 'mongodb://' + host + ':' + port + '/' + dbName;

var connection = mongoose.connect(connectionString, opts);
autoIncrement.initialize(connection);

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin'));
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
};

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(allowCrossDomain);

var studienplaene = require('./routes/studienplaene'); //routes are defined here
var notenplaene = require('./routes/notenplaene'); //routes are defined here
var kurse = require('./routes/kurse');

app.use('/api/stundenplan', studienplaene); //This is our route middleware
app.use('/api/notenplan', notenplaene); //This is our route middleware
app.use('/api/kurse', kurse); //This is our route middleware

module.exports = app;
