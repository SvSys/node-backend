/**
 * Created by jan on 22.07.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kuScheme = new Schema({
    kurs_id: String,
    leiste: String,
    lehrer: {type: String, index: true},
    schueler: [String],
    max: Number
});

module.exports = mongoose.model('Kurs', kuScheme);
