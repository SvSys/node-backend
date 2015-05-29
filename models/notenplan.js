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
    pergebnisse: {type: Array, validate: [validator, "Object ist too big"] },
    noten: {type: Schema.Types.Mixed, validate: [validator, "Object is too big"]},
    sid : Number
});
npScheme.plugin(autoIncrement.plugin, 'Notenplan');

module.exports = mongoose.model('Notenplan', npScheme);
