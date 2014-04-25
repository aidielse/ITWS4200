//This function converts JSON data to CSV format and forces the user to download the complete CSV
function JSONToCSVConverter(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

$(document).ready(function() {
    //Event listeners for the user clicking the buttons on the page.

    //this listener simply alerts the user as to what's going on. The actual submitting of the form on the index.html page is what begins tweet fetching. 
    $('#getTweets').click(function() {
        alert("node-tweets.json will be saved to the local directory, check the console for task completion. If a file already exists, it will be replaced.");
    })
    //waits for the user to want to read tweets, then loads them on the page.
    $('#readTweets').click(function() {

        $.getJSON("readTweets",function(data) {
            var i = 0;
            var num_tweets = 0;

            function updateTweets() {
                if (num_tweets > 4) {
                    var temp = num_tweets-5;
                    $('#'+temp).fadeOut("slow");
                }
                var temp = "<div id='" + num_tweets + "' class='tweet'>" + "<img class='prof_pic' src='" + data[i].user.profile_image_url + "'/>" + "<div class='text'>" + data[i].text + "</div>";
                //adds the username, closes the divs and adds a <br>
                temp += "<div class='username'>--" + data[i].user.screen_name + "</div></div>";
                //we then prepend the tweet to the main page
                $("body").append(temp);
                //increment i and num_tweets
                i++; 
                //alert("i = " + i);
                num_tweets++;
            }
            setInterval(function(){updateTweets()},3000);
        })
        .fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! could not retrieve tweets from the database.'); }) 
    })
    //this listener waits for the convert button to be clicked, it instantiates the JSON to CSV converter.
    $("#convert").click(function() {

        //get our json file, feed it into the converter function
        $.getJSON("node-tweets.json",function(data) {
            JSONToCSVConverter(data,"node-tweets",true);
        })
        //if getJSON fails, inform the user.
        .fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! are you sure that there is a .json file in the local directory?'); })  
    });
    //this code chunk constructs the initial sources graph
    $.get("sources", function(e) {
       // alert(e);
       var result = e.split(",");
       //sum keeps track of the total percentage of languages that are one of the 6 we're tracking
       var sum = 0;
       //iterate through, get a nice clean percent for each number
       //sum up the sum variable
       for(var i = 0; i < 4; i++) {
            result[i] = Math.floor(result[i]/10);
            sum += result[i];
        }
        var baz = 100-sum;

        //data for the PolarArea graph
        var data = [
            {
                value: result[0],
                color:"#F7464A"
            },
            {
                value : result[1],
                color : "#E2EAE9"
            },
            {
                value : result[2],
                color : "#D4CCC5"
            },
            {
                value : result[3],
                color : "#949FB1"
            },
            {
                value : baz,
                color: "#F38630"
            }
        ]
        //get the canvas that we're going to use
        var ctx = document.getElementById("source_chart").getContext("2d");
        //start the Polar Area chart
        new Chart(ctx).PolarArea(data);
        //manage html on the page to display percentages nicely
        var output1 = "Tweets from Web: " + result[0] + "%"; 
        var output2 = "Tweets from Iphone: " + result[1] + "%";
        var output3 = "Tweets from Android: " + result[2] + "%";
        var output4 = "Tweets from Blackberry: " + result[3] + "%";
        var output5 = "Tweets from Other: " + baz + "%";

        $("#source_color1").html(output1);
        $("#source_color2").html(output2);
        $("#source_color3").html(output3);
        $("#source_color4").html(output4);
        $("#source_color5").html(output5);
    });

    //this code chunk constructs the count Hashtags graph upon initial page load
    $.get("countHashtags", function(e) {
        var num = Math.floor(e/10);
        //alert(e/10);
        //data for pie chart. comes from server.js
        var data = [
           {
                value: num,
                color:"#F38630"
            },
            {
                value : 100 - num,
                color : "#E0E4CC"
            }         
        ]
        //chartjs stuff
        var ctx = document.getElementById("first_chart").getContext("2d");
        new Chart(ctx).Pie(data); 
        //update html to show percentages
        var output1 = "Tweets With a Hashtag in Them: " + num + "%";  
        var baz = 100 - num;
        var output2 = "Tweets Without a Hashtag in Them: " + baz + "%";
        $("#color1").html(output1);
        $("#color2").html(output2);  
    });
    //this code chunk constructs the languages graph on initial page load
    $.get("countLanguages", function(e) {
        //get the data we need from server.js
       // alert(e);
       //we can then parse the string by commas
       var result = e.split(",");
       //sum keeps track of the total percentage of languages that are one of the 6 we're tracking
       var sum = 0;
       //iterate through, get a nice clean percent for each number
       //sum up the sum variable
       for(var i = 0; i < 6; i++) {
            result[i] = Math.floor(result[i]/10);
            sum += result[i];
        }
        var baz = 100-sum;

        //data for the doughnut graph
        var data = [
            {
                value: result[0],
                color:"#F7464A"
            },
            {
                value : result[1],
                color : "#E2EAE9"
            },
            {
                value : result[2],
                color : "#D4CCC5"
            },
            {
                value : result[3],
                color : "#949FB1"
            },
            {
                value : result[4],
                color : "#4D5360"
            },
            {
                value : result[5],
                color : "#E0E4CC"
            },
            {
                value : baz,
                color: "#F38630"
            }
        ]
        //get the canvas that we're going to use
        var ctx = document.getElementById("lang_chart").getContext("2d");
        //start the doughnut chart
        new Chart(ctx).Doughnut(data);

        var output1 = "Tweets in English: " + result[0] + "%"; 
        var output2 = "Tweets in Spanish: " + result[1] + "%";
        var output3 = "Tweets in Japanese: " + result[2] + "%";
        var output4 = "Tweets in Italian: " + result[3] + "%";
        var output5 = "Tweets in French: " + result[4] + "%";
        var output6 = "Tweets in German: " + result[5] + "%";
        var output7 = "Other: " + baz + "%";

        $("#lang_color1").html(output1);
        $("#lang_color2").html(output2);
        $("#lang_color3").html(output3);
        $("#lang_color4").html(output4);
        $("#lang_color5").html(output5);
        $("#lang_color6").html(output6);
        $("#lang_color7").html(output7);

    });

});
    //this code chunk updates the graphs every 15 seconds
    setInterval(function() {


        $.get("sources", function(e) {
           // alert(e);
           var result = e.split(",");
           //sum keeps track of the total percentage of languages that are one of the 6 we're tracking
           var sum = 0;
           //iterate through, get a nice clean percent for each number
           //sum up the sum variable
           for(var i = 0; i < 4; i++) {
                result[i] = Math.floor(result[i]/10);
                sum += result[i];
            }
            var baz = 100-sum;

            //data for the Polar Area graph
            var data = [
                {
                    value: result[0],
                    color:"#F7464A"
                },
                {
                    value : result[1],
                    color : "#E2EAE9"
                },
                {
                    value : result[2],
                    color : "#D4CCC5"
                },
                {
                    value : result[3],
                    color : "#949FB1"
                },
                {
                    value : baz,
                    color: "#F38630"
                }
            ]
            //get the canvas that we're going to use
            var ctx = document.getElementById("source_chart").getContext("2d");
            //start the Polar Area chart
            new Chart(ctx).PolarArea(data);
            //manage html on the page to display percentages nicely
            var output1 = "Tweets from Web: " + result[0] + "%"; 
            var output2 = "Tweets from Iphone: " + result[1] + "%";
            var output3 = "Tweets from Android: " + result[2] + "%";
            var output4 = "Tweets from Blackberry: " + result[3] + "%";
            var output5 = "Tweets from Other: " + baz + "%";

            $("#source_color1").html(output1);
            $("#source_color2").html(output2);
            $("#source_color3").html(output3);
            $("#source_color4").html(output4);
            $("#source_color5").html(output5);

        });


        //this code chunk constructs handles the countHashtag Graph
        $.get("countHashtags", function(e) {
            var num = Math.floor(e/10);
            //alert(e/10);
            //data for pie chart. comes from server.js
            var data = [
               {
                    value: num,
                    color:"#F38630"
                },
                {
                    value : 100 - num,
                    color : "#E0E4CC"
                }         
            ]
            //chartjs stuff
            var ctx = document.getElementById("first_chart").getContext("2d");
            new Chart(ctx).Pie(data); 
            //update html to show percentages
            var output1 = "Tweets With a Hashtag in Them: " + num + "%";  
            var baz = 100 - num;
            var output2 = "Tweets Without a Hashtag in Them: " + baz + "%";
            $("#color1").html(output1);
            $("#color2").html(output2);  
        });
        $.get("countLanguages", function(e) {
            //get the data we need from server.js
           // alert(e);
           //we can then parse the string by commas
           var result = e.split(",");
           //sum keeps track of the total percentage of languages that are one of the 6 we're tracking
           var sum = 0;
           //iterate through, get a nice clean percent for each number
           //sum up the sum variable
           for(var i = 0; i < 6; i++) {
                result[i] = Math.floor(result[i]/10);
                sum += result[i];
            }
            var baz = 100-sum;
            //data for the doughnut graph, contains colors and size values for each item 
            var data = [
                {
                    value: result[0],
                    color:"#F7464A"
                },
                {
                    value : result[1],
                    color : "#E2EAE9"
                },
                {
                    value : result[2],
                    color : "#D4CCC5"
                },
                {
                    value : result[3],
                    color : "#949FB1"
                },
                {
                    value : result[4],
                    color : "#4D5360"
                },
                {
                    value : result[5],
                    color : "#E0E4CC"
                },
                {
                    value : baz,
                    color: "#F38630"
                }
            ]
            //get the canvas that we're going to use
            var ctx = document.getElementById("lang_chart").getContext("2d");
            //start the doughnut chart
            new Chart(ctx).Doughnut(data);

            var output1 = "Tweets in English: " + result[0] + "%"; 
            var output2 = "Tweets in Spanish: " + result[1] + "%";
            var output3 = "Tweets in Japanese: " + result[2] + "%";
            var output4 = "Tweets in Italian: " + result[3] + "%";
            var output5 = "Tweets in French: " + result[4] + "%";
            var output6 = "Tweets in German: " + result[5] + "%";
            var output7 = "Other: " + baz + "%";
            
            $("#lang_color1").html(output1);
            $("#lang_color2").html(output2);
            $("#lang_color3").html(output3);
            $("#lang_color4").html(output4);
            $("#lang_color5").html(output5);
            $("#lang_color6").html(output6);
            $("#lang_color7").html(output7);

        });
    },15000);

