var mongoose = require('mongoose');

//Connect to database
mongoose.connect('localhost');


//Create basic message model
//////Creates a Model for the MongoDB, sort of like a table definition in SQL dbs I guess.
//////Mongoose in using this structure can then give an api so that developers can programatically operate on the database in an expected way
//////Kind of like an Interface for programming languages, it gives an accepted and expected structure to the data that we will br working with
var Message = mongoose.model('Message', {
	title: String,
	message: String,
	created: Date
});

module.exports.Message = Message