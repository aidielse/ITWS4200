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
		//read in the index.html file
		fs.readFile('./index.html', function (err,html) {
			if (err) {
				throw err;
			}
			http.createServer(function(request, response) {
				//if the user doesn't have a cookie and tries to navigate to index.html,
				//a script will redirect them to temp.html. This if statement serves the
				//temp.html page
				if(request.url == "/temp.html") {
					response.writeHead(200, {'Content-Type': 'text/html'});
	        		fs.createReadStream('./temp.html').pipe(response);
	       			return;
				}
				//passes the Chart.js code to the get request
				else if (request.url =="/Chart.js-master/Chart.js") {
					response.writeHead(200, {'Content-Type': 'text/javascript'});
	        		fs.createReadStream('./Chart.js-master/Chart.js').pipe(response);
	       			return;
				}
				else if(request.url =="/getTweets?") {
		    		//execute getTweets function, give the user the index.html page.
		    		response.writeHeader(200, {"Content-Type": "text/html"});  
				    response.write(html);  
				    response.end();
				    getTweets();
		    	}
		    	//executes the buildTweetDatabase function, gives the user index.html
		    	else if(request.url == "/buildTweetDatabase?") {
		    		buildTweetDatabase();
		    		response.writeHeader(200, {"Content-Type": "text/html"});  
				    response.write(html);  
				   	response.end();
		    	}
		    	//This if statement counts the number of tweets with hashtags in them and returns the number
		    	//in the response statement
		    	else if(request.url == "/countHashtags") {
		    		//connect to the database
					
					//this mongodb call counts the number of tweets with hashtags
	 			 	collection.count({'entities.hashtags' : {$not : {$size :0}}}, function(err,count) {
	 			 		//respond with the number of tweets with hashtags
	 			 		response.writeHeader(200, {"Content-Type": "text/plain"});  
	 			 		response.write(count.toString());
	 			 		response.end();
	  	 			});
				}
				//this statement finds the number of tweets that come from the web, iphone, android, and blackberry
				else if(request.url == "/sources") {
					//counts the number of tweets from the web, stores in countweb
					collection.count({'source' : 'web'}, function(err,countweb) {
						//counts the number of tweets from iphone, stores in countiphone
						collection.count({'source' : '<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>'}, function(err,countiphone) {
							//counts the number of tweet from Android, stores in countandroid
							collection.count({'source' : '<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>'},function(err,countandroid) {
								//counts the number of tweets from blackberry, stores in countblackberry
								collection.count({'source' : '<a href=\"http://blackberry.com/twitter\" rel=\"nofollow\">Twitter for BlackBerry®</a>'}, function(err,countblackberry) {
									//output string to be put in the response, separate values with commas
									var output = countweb.toString() + "," + countiphone.toString() + "," + countandroid.toString() + "," + countblackberry.toString();
									//write to response
									response.writeHeader(200, {"Content-Type": "text/plain"});  
									response.write(output);
									response.end();
								});
							});
						});
					});
				}
				//this statement finds the number of posts from english, spanish, japanese, italian, french, and german
				else if (request.url == "/countLanguages") {
					//connect to the database
					
					//count the tweets that are in english, store in counten
					collection.count({'lang' : 'en'}, function(err,counten) {
						//count the tweets that are in spanish, store in countes
						collection.count({'lang' : 'es'}, function(err,countes) {
							//count the tweets that are in japanese, store in countja
							collection.count({'lang' : 'ja'}, function(err,countja) {
								//count the tweets that are in italian, store in countit
								collection.count({'lang' : 'it'}, function(err,countit) {
									//count the tweets that are in french, store in countfr
									collection.count({'lang' : 'fr'}, function(err,countfr) {
										//count the tweets that are in german, store in countde
										collection.count({'lang' : 'de'}, function(err,countde) {
											//output string for the response, values are separated by commas
											var output = counten.toString() + "," + countes.toString() + "," + countja.toString() + "," + countit.toString() + "," + countfr.toString() + "," + countde.toString();
											//write the responses
											response.writeHeader(200, {"Content-Type": "text/plain"});  
											response.write(output);
											response.end();	
										});
									});
								});
							});
						});
					});
				}

		    	else if(request.url == "/readTweets") {
		    		//connect to database

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
		console.log("Listener started on port: " + port);

		//this function is from the previous lab and gets 1000 tweets from twitter.
		function getTweets() {
			console.log("Getting Tweets...");
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







