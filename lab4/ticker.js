//this is where all of the fun happens

//once the document is loaded
$(document).ready(function() {
  //get the JSON data from tweets.json and store it in the data variable
  
 	$.getJSON("tweets.json", function(data) {

  	/*alert("tweets.json has been loaded");
  	})
  	.error(function(jqXHR, textStatus, errorThrown){
   	alert("error: " + errorThrown);*/

    //i keeps track of what tweet is next.
    var i = 0;
    //num tweets helps keep track of the next tweet to be removed from the page
    var num_tweets = 0;
    //$(".tweet").fadeIn("slow");
    //this function essentially does everything
    function updateTweets() { 

    //if the number of tweets on the screen is greater than 4
      if(num_tweets > 4) {
        //temp keeps track of what tweet is about to be faded out
        var temp = num_tweets - 5;
        $('#' + temp).fadeOut("slow");
        //$('#' + temp).remove();
        
      }
      //temp stores the tweet to be added to the page
      //we put up the tweet itself, the user's profile picture, and their username
      //if the url of the user's profile picture does not contain a profile picture, a picture of Prof. Plotka is put up instead.
      var temp = "<div id='" + num_tweets + "' class='tweet'>" + "<img class='prof_pic' src='" + data[i].user.profile_image_url + "' onerror=" + '"this.src=' + "'./photo.jpg';" + '"' + "/>" + "<div class='text'>" + data[i].text + "</div>";
      //adds the username, closes the divs and adds a <br>
      temp += "<div class='username'>--" + data[i].user.screen_name + "</div></div><br>";
      //we then prepend the tweet to the main page
      $("#content").prepend(temp);
      //$(".tweet").fadeIn("fast");
      //increment i and num_tweets
      i++; 
      num_tweets++;
    }
    //call updateTweets() every 3 seconds
    setInterval(updateTweets,3000);			
  })
})