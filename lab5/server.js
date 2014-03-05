//variables for node.js, express, fs. and ntwitter to use.
var express  = require('express'),
	  twitter  = require('ntwitter'),
	  http     = require('http'),
	  fs       = require('fs'),
	  app      = express(),
	  server   = http.createServer(app),
	  io       = require('socket.io').listen(server);
  //sets the listening port to 4321
	var port = process.env.PORT || 4321;
  //starts listener, informs user
	server.listen(port, function() {
		console.log("Listener started: " + port);
	});
//twitter key information is stored here
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
      //json item gets stored in counter, i is incremented
      counter[i] = data;
      i++;
      //once we get 1000 tweets, call the writeData() function
      if (i == 1000) {
        writeData();
      }
  });
  //if there is an error getting data from twitter, print a user friendly message to the console with an error code
  stream.on('error', function(reason, code) {
    console.log('socket error: reason ' + reason + ', code ' + code);
  });
});
//this function writes the data to tweets.json file
function writeData () {

  fs.writeFile('node-tweets.json', JSON.stringify(counter), function (err) {
    if (err) throw err;
  console.log('node-tweets.json saved.');
  //end function is called
  end();
  });
}
//end function exits the entire process and closes the program
function end() {
  process.exit();
}