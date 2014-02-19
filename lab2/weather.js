$(document).ready(function() {
	// store the api key for forecast.io
	var key = "d93186df06f7fd589b756967278f9d95";
	//variables for latitude, longitude, geocoding, and location. to be used later
	var lati, longi, geocd, location;
	//this function is called if we get the current position
	function success(pos) {
		//latitude and longitude are stored in variables
		lati = pos.coords.latitude.toString();
		longi = pos.coords.longitude.toString();

		console.log( "Latitude: " + lati );
  		console.log( "Longitude: " + longi );
  		//the init function is called
  		init();
	}
	//if we cannot get the current position, an error is logged
	function err(error) {
		console.log('error: ' + error.code + ' ' + error.message);
	}
	//the initialize function gets the current location.
	//and calls the forecast.io API
	function init() {
		//create a new geocoder
		geocd = new google.maps.Geocoder();
		//temporary variables
		var city, state;
		//parse the latitude and longitude for the geocode to use
		var latlng = new google.maps.LatLng(parseFloat(lati), parseFloat(longi));
		//get api data from google maps api
		geocd.geocode({'latLng':latlng}, function(res,stat) {
			//if data was gotten successfully
			if(stat == google.maps.GeocoderStatus.OK) {
				//the following logic parses the data and prepares the city and state variables
				if ( res[1] ) {
        			for ( var i=0; i<res[0].address_components.length; i++ ) {
          				for ( var j=0; j<res[0].address_components[i].types.length; j++ ) {
            				if ( res[0].address_components[i].types[j] == "locality" ) {

             					city = res[0].address_components[i];
           					}
            
            				if ( res[0].address_components[i].types[j] == "administrative_area_level_1" ) {

              					state = res[0].address_components[i];
            				}
          				}
        			}
      			}
      			//city and state are saved to the location variable
     			location = city.long_name + ", " + state.short_name;
     			//forecast.io API is called
     			call();
    		} 
    		//if we cannot get the location from google maps API:
			else {

				console.log("location error: " + stat);
			}
		});
	}
	//this function processes all of the data from Forecast IO and constructs the html for the webapp
	function call() {
		//first get get our JSON data,
		$.getJSON("https://api.forecast.io/forecast/" + key + "/" + lati + "," + longi + "?callback=?", function(data) {

			//variables to be output to the user
			var ctime = data.currently.time;
		    var icn = data.currently.icon;
		    var temp = data.currently.temperature;
		    var atemp = data.currently.apparentTemperature;
		    var wspd = data.currently.windSpeed;
		    var hmdy = data.currently.humidity;

		    //foo stores all of the data to be put into the html document at the end
  			var foo = "<div id= 'container'>";
  			var icon;

  			//the following if/elseif/else statements determine the correct icon to be displayed
  			if(icn == "clear-day") {
  				icon="01";
  			}
  			else if(icn == "clear-night") {
  				icon="02";
  			}
  			else if(icn == "rain") {
  				icon="03";
  			}
  			else if(icn == "snow") {
  				icon="04";
  			}
  			else if(icn == "sleet") {
  				icon="05";
  			}
  			else if(icn == "wind") {
  				icon="06";
  			}
  			else if(icn == "fog") {
  				icon="07";
  			}
  			else if(icn == "cloudy") {
  				icon="08";
  			}
  			else if(icn == "partly-cloudy-day") {
  				icon="09";
  			}
  			else if(icn == "partly-cloudy-night") {
  				icon="10";
  			}
  			else {
  				icon = "00";
  			}
  			//here we construct the html to be output to the user, with correct div's and ID's for my CSS
			foo += "<div id='everything'>";
			foo += "<img src='icon/" + icon + ".png' height='200' width='200' id='icon' />";
			foo += "<div id='location'>" + location + "</div>";
			foo += "<div id='temperature'>" + Math.round(temp) + "<sup>&deg;F</sup></div>";
			//if the apparant temp != the actual temp, print this. else don't bother
			if ( Math.round(temp) != Math.round(atemp)) {
				foo += "<div id='feelsLike'>Feels like: " + Math.round(atemp) + " &deg;F</div>";
			}
			foo += "<div id='windSpeed'>Wind speed: " + wspd + " mph</div>";
			foo += "<div id='humidity'>Humidity: " + hmdy * 100 + "&#37;</div>";
			//d is a temporary date placeholder for printing the current time
    		var d = new Date(0,0,0,0,0,ctime,0);
			foo += "<div id='time'>Time: "; 
			//the current time is processed so that we can determine the time when the webapp was loaded
			//and output it to the page
			if((d.getHours() + 19) % 12 == 1) {
				foo += "1 hour and " + d.getMinutes();
			}
			else {
				foo += ((d.getHours() + 19) % 12) + " hours and " + d.getMinutes();
			}

			if(d.getMinutes() == 1) {foo += " minute EST</div>";}

			else {foo += " minutes EST</div>";}

 // alert(temp);
 			//put everything in the index.html page
  			document.getElementById("weather").innerHTML = foo;
		})
	}
	//this starts the whole webapp, it calls success(), which calls init(), which calls call().
	navigator.geolocation.getCurrentPosition( success, err);
});