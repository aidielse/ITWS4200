	var express  = require('express'),
		twitter  = require('ntwitter'),
		http     = require('http'),
		fs       = require('fs'),
	    app      = express(),
		server   = http.createServer(app),
		io       = require('socket.io').listen(server);
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
	    	if(request.method=="POST") {
	    		//execute getTweets function, give the user the index.html page.
	    		getTweets();
	    		response.writeHeader(200, {"Content-Type": "text/html"});  
			    response.write(html);  
			    response.end();
	    	}

	    	else {
	    		//our index.html page requests jquery, this if statement waits for that request and gives it jquery
	    		if(request.url === '/jquery-1.11.0.min.js') {
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
		  consumer_key: 'GeSYIowhwevxrLyxQCVOg',
		  consumer_secret: 'Zw4tSgLyOYZ9DifBOqqs4VTtGg0Xa1yHiDDyqSkuo',
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