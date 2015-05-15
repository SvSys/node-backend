/**
 * Created by jan on 15.05.15.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var spScheme = new Schema({
    title: String,
    releaseYear: String,
    director: String,
    genre: String
});

module.exports = mongoose.model('Studienplan', spScheme);