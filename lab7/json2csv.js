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
                temp += "<div class='username'>--" + data[i].user.screen_name + "</div></div><br>";
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
    })   
});