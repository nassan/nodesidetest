//Helpful links
//http://mongoosejs.com/
//http://expressjs.com/en/index.html

//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var Message = require('./models/MessageModel.js').Message
//Create server
//////Instantiates (sort of) an instance (sort of) of an express function
//////Giving us access to all of expresses cool thngs like the middleware used below when calling the use() function of app.
//////I believe it could be said that use() is a function on the prototype of express, I think I'm saying that correctly :) 
var app = express();


//Use middleware
//////Middleware, meaning that express upon receiving something from the client, will then pass that something through a chain of middleware
//////In other words, calling each one of these use functions

//////use() gets called everytime a request is received, as opposed to get, post, etc.

//////This is the middleware that is imported from the  body-parser package
app.use(bodyParser.json());

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
	.delete(deleteMessage)


//Create an endpoint for the html form
app.route('/defaultform').get(function(req,res,next){
	res.sendFile(__dirname + '/public/home.html')
})

function getMessages(req, res, next) {
	//////Allow to get message by an id, and allow skip, limit, and  
	var query = Message.find();

	//////Allowing an Id filter
	if (req.params.id) {
		query.where('_id', req.params.id);
	}
	else{
		query.where('_id');
	}

	//If present, add a skip parameter to the query
	if (req.query.skip) {
		var skip_value = Number(req.query.skip)
		if (skip_value <= 0 || skip_value === NaN) 
			return res.sendStatus(400)
		query.skip(skip_value)
	}

	//If present, add a limit parameter to the query
	if (req.query.limit) {
		var limit_value = Number(req.query.limit)
		if (limit_value <= 0 || limit_value === NaN) 
			return res.send(400)
		query.limit(limit_value)
	}

	//If present, add a sort parameter to the query
	if (req.query.sort) {
		if (['asc', 'desc', 'ascending', 'descending', '1', '-1'].indexOf(req.query.sort) >= 0) {		
			query.sort({"_id" : req.query.sort})
		}
		else{
			return res.sendStatus(400)

		}
	}

	//Actually query against the running mongodb instance sitting on localhost
	query.exec(function(err, messages) {
			console.log(messages)
			if (err)
				next(err)

			res.send(messages);
	})
}

function createMessage(req, res, next) {

	var message = new Message(req.body);
	message.save(function(err) {
		if (err) {

		  //Do you think it might be preferable to use next(err) ?
		  //////Passing err to next() will stop the middleware chain, and jump to the error handling middleware
		  next(err)

		  //What would happen if there we removed the return?
		  //////It will send the response, but will continue executing, 
		  //////so we will get errors like trying to modify the response after it has been sent, etc.
		}

		res.sendStatus(200);
	});
}

function deleteMessage(req, res, next) {

	if (!req.params.id)
		return res.sendStatus(400)

	Message.findByIdAndRemove(req.params.id, function(err, message) {
		if (err)
			next(err)
		res.sendStatus(200);
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
		if (err) 
			next(err);
		res.sendStatus(200);
	})
}

function stam(req, res, next) {
	res.send('stam');
}

function catch500Errors(err, req, res, next){
	res.send(500,"A Universal 500 error")
}
app.use(catch500Errors)
//

// Catch everything else
app.use(function(req, res, next) {
	res.sendStatus(404);
});


//Can you explain this?
//////This would be an environment variable on the OS named PORT, the app could pull up that value and hopefully listen on that port.
app.listen(4000);
console.log("Server is now listening...")
