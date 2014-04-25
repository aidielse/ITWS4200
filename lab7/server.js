	var express  = require('express'),
		twitter  = require('ntwitter'),
		http     = require('http'),
		fs       = require('fs'),
	    app      = express(),
		server   = http.createServer(app),
		io       = require('socket.io').listen(server);
		MongoClient = require('mongodb').MongoClient;

	//the port our web server uses
	var port = 4321;
	//read in the index.html file
	fs.readFile('./index.html', function (err, html) {
	    if (err) {
	        throw err; 
	    }      
	    //this creates the server and starts a listener on port 4321
	    http.createServer(function(request, response) {
	    	//if the http request is "POST", it must be our web-server posting to it self. 
	    	//The only time the webserver posts to itself is when the user wants to get new tweets.
	    	//console.log(request.url);
	    	if(request.url =="/getTweets?") {
	    		//execute getTweets function, give the user the index.html page.
	    		response.writeHeader(200, {"Content-Type": "text/html"});  
			    response.write(html);  
			    response.end();
			    getTweets();
	    	}

	    	else if(request.url == "/buildTweetDatabase?") {
	    		buildTweetDatabase();
	    		response.writeHeader(200, {"Content-Type": "text/html"});  
			    response.write(html);  
			    response.end();
	    	}

	    	else if(request.url == "/readTweets") {
	    		//connect to database
	    		MongoClient.connect("mongodb://localhost:27017/WebSciLab7db", function(err, db) {
	  				if(err) {
	    				console.log("We could not connect to our MongoDB database");
	 				}
			 		var collection = db.collection('tweets');			 		
			 		//get all tweets from database
			 		var temp;
			 		temp = collection.find({}).toArray(function(err,results) {
			 			console.log("tweets retrieved.");
			 			//we send the tweets from the database back as the response to the get request.
			 			//thereby allowing local javascript/jquery to do whatever it wants and have DOM access
			 			results.response = response;
			 			response.writeHeader(200, {"Content-Type": "text/json"});  
						response.write(JSON.stringify(results));
			    		response.end();
			 		});
				});
	    	}

	    	//our index.html page requests jquery, this if statement waits for that request and gives it jquery
	    	else if(request.url === '/jquery-1.11.0.min.js') {
	    		//console.log ('getting jquery');
	    		response.writeHead(200, {'Content-Type': 'text/javascript'});
        		fs.createReadStream('./jquery-1.11.0.min.js').pipe(response);
       			return;
	    	}
	    	//our index.html page requests our json2csv.js file, this if statement waits for that request and gives it the file
	    	else if(request.url === '/json2csv.js') {
	    		//console.log("getting json2csv");
	    		response.writeHead(200, {'Content-Type': 'text/javascript'});
        		fs.createReadStream('./json2csv.js').pipe(response);
       			return;
	    	}
	    	//our index.html page requests node-tweets.json for our conversion, this if statement waits for that request and gives it the file
	    	else if(request.url === '/node-tweets.json') {
	    		console.log("Executed .json -> .csv Conversion, automatic download via browser was instantiated.");
	    		response.writeHead(200, {'Content-Type': 'text/json'});
        		fs.createReadStream('./node-tweets.json').pipe(response);
       			return;
	    	}
	    	//this is the default response, gives the user the basic index.html page
	    	else {
		        response.writeHeader(200, {"Content-Type": "text/html"});  
		        response.write(html);  
		        response.end();
		    }
	    }).listen(port);
	});
	//inform console of listener instantiation
	console.log("Listener started: " + port);

	//this function is from the previous lab and gets 1000 tweets from twitter.
	function getTweets() {
		console.log("Getting Tweets...");
		//twitter access keys n' such
		var twit = new twitter({
		  consumer_key: 'vTXtCWxwdVxMPD7mKxJMgqTUv',
		  consumer_secret: 'GMRMHMdVE4xBSRd7R6dX93VU7dYJF0zHAT49gXrBcyxuzgBjPy',
		  access_token_key: '2363419033-zOZwhNcZXgMHQvgL3v0wpoLuh2rF13ukhiT7BUR',
		  access_token_secret: 'vHolLD2gmWsBNNIX7JAcHDUfF7USiNsNN5i99pIeMjtFv'
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
		      //once we get 1000 tweets, call the writeData() function
		      if (i == 1000) {
		        writeData();
		        twit.currentTwitStream.destroy();
		      }
		  });
		  //if there is an error getting data from twitter, print a user friendly message to the console with an error code
		  stream.on('error', function(reason, code) {
		    console.log('socket error: reason ' + reason + ', code ' + code);
		  });
		});
		//this function writes the data to tweets.json file
		function writeData () {
			console.log("writing node-tweets.json file...");
		  fs.writeFile('node-tweets.json', JSON.stringify(counter), function (err) {
		    if (err) throw err;
		  });
		  console.log("node-tweets.json saved to local directory.");
	      return;
		}
		return;
	}
	//this function gets 1000 tweets, saves them in a variable in json format, and then writes the whole variable to a MongoDB collection
	function buildTweetDatabase() {
		console.log("building database...");

		//console.log("Getting Tweets...");
		//twitter access keys n' such
		var twit = new twitter({
		  consumer_key: 'vTXtCWxwdVxMPD7mKxJMgqTUv',
		  consumer_secret: 'GMRMHMdVE4xBSRd7R6dX93VU7dYJF0zHAT49gXrBcyxuzgBjPy',
		  access_token_key: '2363419033-zOZwhNcZXgMHQvgL3v0wpoLuh2rF13ukhiT7BUR',
		  access_token_secret: 'vHolLD2gmWsBNNIX7JAcHDUfF7USiNsNN5i99pIeMjtFv'
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
			//connect to MongoDb
			MongoClient.connect("mongodb://localhost:27017/WebSciLab7db", function(err, db) {
	  			if(err) {
	    			console.log("We could not connect to our MongoDB database");
	 			}
	 			var collection = db.collection('tweets');
	 			//delete all old tweets
	 			collection.remove({}, function(err,result) {});
	 			//insert all new tweets
	 			collection.insert(counter,{w:1},function(err,result) {});
			});
		  	console.log("Database built, 1000 tweets added to the database.");
	      	return;
		}
		return;
	}