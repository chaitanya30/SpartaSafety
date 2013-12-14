var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/272');
 
var safetySchema = new Schema({
    Threat: String,
	Location: String,
	Date: {type: Date, default: Date.now},
    Hour: {type: Number, min:0 ,max:23},
    Severity: {type: Number, min:1, max:5},
    flag: Number,
    loc: { lon: Number, lat:Number  }
});
 
module.exports = mongoose.model('incidents', safetySchema);