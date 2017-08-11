
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Google StreetView AJAX request goes here
    var streetStr=$('#street').val();
    var cityStr=$('#city').val();
    var address= streetStr+ ", "+cityStr;

    $greeting.text("So, you want to live at "+ address+ "?");
    var streetViewURL="http://maps.googleapis.com/maps/api/streetview?size=600x300&location="+address+"";
    $body.append('<img class="bgimg" src="'+streetViewURL+'">');


    //NYTimes AJAX request goes here
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+cityStr+'&sort=newest&api-key=8b3f1cd0acbf48feb280124fba39b007';
    $.getJSON(url, function(data){

        $nytHeaderElem.text("New York Times articles about "+cityStr);
        var articles=data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article=articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>'+article.snippet+'</p>'+
                '</li>');
        };
    }).fail( function(e){
        $nytHeaderElem.text("New York times articles cannot be loaded");
    });

    //Wikipedia AJAX request

    var wikiRequestTimeout=setTimeout(function(){
            $wikiElem.text("Failed to get wikipwdia resources");
    },8000);

    var wikiURL="http://en.wikipedia.org/w/api.php?action=opensearch&search="+cityStr+"&format=json&callback=wikiCallBack";
    $.ajax(wikiURL,{
        dataType:"jsonp",
        //jsonp: "callback",
        success: function(response){
            var articleList=response[1];
            for (var i = 0; i < articleList.length; i++) {
                var articleStr=articleList[i];
                var articleurl="http://en.wikipedia.org/wiki/"+articleStr;
                $wikiElem.append('<li><a href="'+articleurl+'"></li>'+articleStr+"</a></li>")
            };

            clearTimeout(wikiRequestTimeout);
        }
    });



    return false;
};

$('#form-container').submit(loadData);
