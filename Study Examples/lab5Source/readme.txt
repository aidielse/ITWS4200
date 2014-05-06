Server will only work after filling in the authentication keys and installing required node modules

Install Node 

cd to the folder where server.js is present
Open the server.js
Fill in the consumer_key, consumer_Secret, access_token_key, access_token_Secret by registering an application with twitter (line 22, 23, 24, 25)


install the required modules
	>npm install express
	>npm install ntwitter
	>npm install socket.io

Run the server 
	>node server.js