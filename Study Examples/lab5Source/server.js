var  express  = require('express'),
	  twitter  = require('ntwitter'),
	  http     = require('http'),
	  fs       = require('fs'),
	  app      = express(),
	  server   = http.createServer(app),
	  io       = require('socket.io').listen(server);

	var port = process.env.PORT || 3000;

	server.listen(port, function() {
		console.log("Listening on " + port);
	});


//APP LOGIC


var twitter = require('ntwitter');
//Enter the following keys after registering the application with Twitter
var twit = new twitter({
   // API key
   // API Secret
   // Access token
   // Access token secret
  consumer_key: 'K3hJPsulIGqCbehjz60Jw',
  consumer_secret: 'QK5aM8PtIlqlwJx9yooKPj4l3zqtpaaGb6soYLd8Q',
  access_token_key: '60922491-xQo5EWJTKCPZBy7MeW2hIR4s8L76HaapGSKOGNO3k',
  access_token_secret: 'GbFwG5XWVzU87kPuqAlH6VfKzbUWuc9kwE6I3bti5KTlg'
});

/* read tweets
until no. of tweets > count 
write into a variable
convert into a file
stringify it*/

var i=0;
//counter is the variable to hold the tweets
var counter = [];
//connect to twitter's sample stream using ntwitter
//writes 1000 tweets into a file named tweets.json
twit.stream('statuses/sample', function(stream) {
  stream.on('data', function (data) {
  	if (i<1000){
  		counter[i++] = data;
    }
    else if( i == 1000){
    	fs.writeFile('tweets.json', JSON.stringify(counter), function (err) {
		  if (err) throw err;
		  console.log('It is saved!');
    		});
    	i++;
    }
  });
});

//Uncomment the code below to read a JSON file
// fs.readFile('tweets.json', function (err,data){
// 	if (err) throw err;
// 	var tweets = JSON.parse(data);
// 	console.log(tweets.length);
// })

