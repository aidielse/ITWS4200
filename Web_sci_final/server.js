	var express  = require('express'),
		twitter  = require('ntwitter'),
		http     = require('http'),
		fs       = require('fs'),
	    app      = express(),
		server   = http.createServer(app),
		io       = require('socket.io').listen(server);
		MongoClient = require('mongodb').MongoClient;

	MongoClient.connect("mongodb://localhost:27017/WebSciLab7db", function(err, db) {
	  	if(err) {
	   		console.log("We could not connect to our MongoDB database");
	 	}

		var collection = db.collection('tweets');
		//the port our web server uses
		var port = 4321;
		//var foo = 1;
		//read in the index.html file
		fs.readFile('./index.html', function (err,html) {

			if (err) {
				throw err;
			}

			http.createServer(function(request, response) {
					//this needs to be something with regular expressions
					if(request.url == "/query?") {
					//	collection.query();
						console.log(request.headers);

					}
					else {
						buildTweetDatabase();
			   			response.writeHeader(200, {"Content-Type": "text/html"});  
						response.write(html);  
						response.end();
					}
			}).listen(port);
		});	

		//this function gets 1000 tweets, saves them in a variable in json format, and then writes the whole variable to a MongoDB collection
		function buildTweetDatabase() {
			console.log("building database...");

			//console.log("Getting Tweets...");
			//twitter access keys n' such
			var twit = new twitter({
			  consumer_key: '2SZaNUWjspD5fGm9SM666yHbh',
			  consumer_secret: 'Hs58Gq9KZniDVEd3ekctNueVIygzkRLAe2x3t8FKDs8QObVlb3',
			  access_token_key: '2363419033-T2qchxk9a0DgFC6DejuVYjhsbRXhs5vU1gjmF2G',
			  access_token_secret: 'URqUUPypYEdzJdxGZL7QdPBIldGZN7uyG4lKmndcKs4rQ'
			});
			//i is an iterator for counter array
			var i=0;
			//counter array holds data from twitter
			var counter = [];
			//connect to twitter
			twit.stream('statuses/sample', function(stream) {
			  //data handler
			  stream.on('data', function (data) {
			  	  twit.currentTwitStream = stream;
			      //json item gets stored in counter, i is incremented
			      counter[i] = data;
			      i++;
			      //this if statement is used to print the progress of this function to the console
			      if(i % 100 == 0) {
			      	console.log(Math.floor((i/1000)* 100) + "% complete.");
			      }
			      //once we get 1000 tweets, call the writeDatabase() function
			      if (i == 1000) {
			        writeDatabase();
			        twit.currentTwitStream.destroy();
			      }
			  });
			  //if there is an error getting data from twitter, print a user friendly message to the console with an error code
			  stream.on('error', function(reason, code) {
			    console.log('socket error: reason ' + reason + ', code ' + code);

			  });
			});

			//this function writes the data to MongoDB
			function writeDatabase () {
				//console.log("writing node-tweets.json file...");
		 		//delete all old tweets
		 		collection.remove({}, function(err,result) {});
		 		//insert all new tweets
		 		collection.insert(counter,{w:1},function(err,result) {});
			  	console.log("Database built, 1000 tweets added to the database.");
			  	return;
			}
			return;
		}
	});