/**
 * Created by jan on 20.05.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

function validator(val) {
    return JSON.stringify(val).length < 2000;
}

var npScheme = new Schema({
    pergebnisse: {
        0: {type: Number, min: 0, max: 15},
        1: {type: Number, min: 0, max: 15},
        2: {type: Number, min: 0, max: 15},
        3: {type: Number, min: 0, max: 15},
        4: {type: Number, min: 0, max: 15}
    },
    noten: {type: Schema.Types.Mixed, validate: [validator, "Object is too big"]},
    sid : Number
});
npScheme.plugin(autoIncrement.plugin, 'Notenplan');

module.exports = mongoose.model('Notenplan', npScheme);