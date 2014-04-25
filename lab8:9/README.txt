Web Science Lab 8/9
Aaron Sedlacek
4/24/2014

I used Node.js for this lab. Mainly Express for the server/listener, fs to write to a file, and ntwitter for twitter API interfacing.

Additionally, I used mongoDB to store tweets from twitter.

I also used Chartjs to create those nice circular charts on the page

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

The terminal/CMD window gets a large amount of relevant/interesting/useful data for the user, so make sure to check it every now and then!

Instead of installing the node Jquery library, I used the default jquery package (see the script tags in index.html) and wrote my own javascript file (json2csv.js) 
so that I could have access to the DOM and the window itself.

This application uses the keys that I registered with twitter for Lab 4 and used for Lab 5 and 6.

This webapp was developed in Safari and Google Chrome, on windows 8 64 bit and Mac OS X Mavericks I think?.

If you try to build the database too frequently, Twitter will respond with error code 420 and not allow you to pull more tweets. This is due to twitter's rate limiting.

This software has not been extensively tested.