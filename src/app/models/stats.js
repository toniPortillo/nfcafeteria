var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');


var statsSchema = new mongoose.Schema({
	day : {type : Number, min : 0},
	hour : {type : Number, min : 0}
} /*{
	timestamps: true
}*/);

statsSchema.plugin(timestamps);


module.exports = mongoose.model('Stats', statsSchema);
