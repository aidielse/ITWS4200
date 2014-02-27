//this is where all of the fun happens

//once the document is loaded
$(document).ready(function() {

  function init() {
    $.getJSON("https://api.twitch.tv/kraken/games/top?limit=5", function(data) {

      //alert(data.top[0].game.name);

      for(var i = 4; i >= 0; i--) {

        var temp = "<div id='" + i + "' class='game'>" + "<img class='game_pic' src='" + data.top[i].game.box.large + "' onerror=" + '"this.src=' + "'./photo.jpg';" + '"' + "/>" + "<div class='text'>" + data.top[i].game.name;
        temp += "<div class='viewers'>Viewers: " + data.top[i].viewers + "</div>" + "<div class='channels'>Channels: " + data.top[i].channels + "</div></div>";
        $("#content").prepend(temp);
      }
    })
  }
  function updateTwitch() {

    $.getJSON("https://api.twitch.tv/kraken/games/top?limit=5", function(data) {

      for(var i = 4; i >= 0; i--) {
        $("#"+i + " .text .viewers").html("Viewers: " + data.top[i].viewers);
        $("#"+i + " .text .channels").html("Channels: " + data.top[i].channels);
      }
    })
  }
  init();
  setInterval(updateTwitch,3000);
});




