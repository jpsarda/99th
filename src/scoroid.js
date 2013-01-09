//Browser Support Code.function 
function ScoreoidQuery(query, callback) {
    var ajaxRequest; // The variable that makes Ajax possible!..
    try {
        // Opera 8.0+, Firefox, Safari...
        ajaxRequest = new XMLHttpRequest();
    } catch (e) {
        // Internet Explorer Browsers...
        try {
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                // Something went wrong.....
                alert("Your browser broke!");
                return false;
            }
        }
    }
    // Create a function that will receive data sent from the server..
    ajaxRequest.onreadystatechange = function () {
        if (ajaxRequest.readyState == 4) {
            var list = JSON.parse(ajaxRequest.responseText);
            callback(list);
        }
    }
    var queryString = "action=curl_request&";
    for (var i in query) {
        queryString += i + "=" + query[i] + "&";
    }
    queryString += "response=json";
    ajaxRequest.open("POST", "scoreoid_proxy.php?action=curl_request", true);
    ajaxRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ajaxRequest.send(queryString);
}