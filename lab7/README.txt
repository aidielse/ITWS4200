Web Science Lab 7
Aaron Sedlacek
4/11/2014

I used Node.js for this lab. Mainly Express for the server/listener, fs to write to a file, and ntwitter for twitter API interfacing.
Additionally, I used mongoDB to store tweets from twitter.

Installation/Execution Instructions:

	1. Make sure you have MongoDb, Node.js, Express, fs, ntwitter, and the mongoDB package:
		brew install node
		brew install mongodb
		npm install express
		npm install fs
		npm install ntwitter
		npm install mongodb

	2. Ensure that MongoDB is started, type the following in a new terminal window:

		mongod

	3. make sure your terminal is in the current directory, then type the following:

		node server.js 

	4. Navigate to 127.0.0.1:4321 in your favorite browser

The terminal/CMD window gets a large chunk of relevant/interesting/useful data for the user, so make sure to check it every now and then!

Instead of installing the node Jquery library, I used the default jquery package (see the script tags in index.html) and wrote my own javascript file (json2csv.js) 
so that I could have access to the DOM and the window itself.

This application uses the keys that I registered with twitter for Lab 4 and used for Lab 5 and 6.

This webapp was developed in Safari and Google Chrome, on windows 8 64 bit and Mac OSX.

FIXED SECURITY FLAW: There is a large security flaw. Because this web server responds to ALL post requests by running the getTweets function, An attacker could easily perform a Denial of Service attack. By spamming POST requests thereby forcing the server to run getTweets() hundreds of times, it forces the node. js server to get tied up and probably eventually crash.

This software has not been extensively tested.