//this is where all of the fun happens

//once the document is loaded
$(document).ready(function() {
  //the init function gets the initial data from the Twitch API, the reason that 
  //init and updateTwitch are two seperate functions is because init() creates the
  //div tags.
  function init() {
    //gets the top 5 most viewed games from twitch API
    $.getJSON("https://api.twitch.tv/kraken/games/top?limit=5", function(data) {

      for(var i = 4; i >= 0; i--) {
        //construct divs for each game, build the content to be displayed
        var temp = "<div id='" + i + "' class='game'>" + "<img class='game_pic' src='" + data.top[i].game.box.large + "' onerror=" + '"this.src=' + "'./photo.jpg';" + '"' + "/>" + "<div class='text'>" + data.top[i].game.name;
        temp += "<div class='viewers'>Viewers: " + data.top[i].viewers + "</div>" + "<div class='channels'>Channels: " + data.top[i].channels + "</div></div>";
        //place the content on the page
        $("#content").prepend(temp);
      }
    })
  }
  //this function is used to update the figures on the page
  function updateTwitch() {
    //get potentially updated data
    $.getJSON("https://api.twitch.tv/kraken/games/top?limit=5", function(data) {
      //replace old data with new data
      for(var i = 4; i >= 0; i--) {
        $("#"+i + " .text .viewers").html("Viewers: " + data.top[i].viewers);
        $("#"+i + " .text .channels").html("Channels: " + data.top[i].channels);
      }
    })
  }
  //initialize and run update every 5 seconds
  init();
  setInterval(updateTwitch,5000);
});




