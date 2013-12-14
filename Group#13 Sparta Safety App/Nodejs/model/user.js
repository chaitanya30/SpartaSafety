var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost:27017/cmpe');
 
var userSchema = new Schema({
    
    emergencyPhoneNumbers:Array,
    emergencyEmails:Array,
    userName: String,
    email: String
});
 
module.exports = mongoose.model('user', userSchema);