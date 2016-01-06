//Helpful links
//http://mongoosejs.com/
//http://expressjs.com/en/index.html

//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
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


//Create server
//////Instantiates (sort of) an instance (sort of) of an express function
//////Giving us access to all of expresses cool thngs like the middleware used below when calling the use() function of app.
//////I believe it could be said that use() is a function on the prototype of express, I think I'm saying that correctly :) 
var app = express();

//Use middleware
//////Middleware, meaning that express upon receiving something from the client, will then pass that something through a chain of middleware
//////In other words, calling each one of these use functions

//////use gets called everytime a request is received, as opposed to get, post, etc.

//////This is the middleware that is imported from the  body-parser package
app.use(bodyParser());

//////This is custom middleware that uses the function pizzaDebug defined on line 43
app.use(pizzaDebug);

function pizzaDebug (req,res,next) {
  
  if (req.query.debug === 'pizza') {
    return res.send('i like pizza');
  }
  
  next();
}

//Add our message resource
app.route('/messages/:id?')
	.get(getMessages)
	.post(createMessage)
	.put(updateMessage)

function getMessages(req, res, next) {

	var query = Message.find();

	if (req.params.id) {
		query.where('_id', req.params.id);
	}

	query.limit(req.query.limit || 10)
		.exec(function(err, messages) {
			if (err)
				return res.send(500, 'Oops')

			res.send(messages);
		})
}

function createMessage(req, res, next) {

	var message = new Message(req.body);

	message.save(function(err) {
		if (err) {
		  //Do you think it might be preferable to use next(err) ?
		  //What would happen if there we removed the return
			return res.send(500, 'Oops')
		}

		res.send(200);
	});
}

function deleteMessage(req, res, next) {

	var message = new Message(req.body);

	message.save(function(err) {
		if (err) {
		  //Do you think it might be preferable to use next(err) ?
		  //What would happen if there we removed the return
			return res.send(500, 'Oops')
		}

		res.send(200);
	});
}

function updateMessage(req, res, next) {

	if (!req.params.id) {
		return res.send(400, ' missing message id');
	}

	Message.update({
		_id: req.params.id
	}, {
		$set: {
			title: req.body.title,
			message: req.body.message
		}
	}, function(err) {
		if (err) return res.send(500);
		res.send(200);
	})
}

function stam(req, res, next) {
	res.send('stam');
}


// Catch everything else

app.use(function(req, res, next) {
	res.send('hmmm 404');
});


//Can you explain this?
//////This would be an environment variable named PORT, the app could pull up that value and hopefully listen on that port.
app.listen(process.env.PORT);