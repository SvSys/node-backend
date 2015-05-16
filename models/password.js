/**
 * Created by jan on 16.05.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pScheme = new Schema({
    sid : Number,
    password: String
});

module.exports = mongoose.model('Password', pScheme);