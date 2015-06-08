function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(51.508742,-0.120850),
    zoom:2,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

document.addEventListener("DOMContentLoaded", function(event) {
  google.maps.event.addDomListener(window, 'load', initialize);
  var socket = io.connect('http://localhost:8080');
  $.get("http://ipinfo.io", function(response) {
    var location = response;
    $.post('/location', location, function(data) {
      var trendingData = data;
      console.log(trendingData.trends);
      $trending = $('#trending');
      for (var i=0; i < trendingData.trends.length; i++) {
        $trending.append('<li><a href=\''+ trendingData.trends[i].url + '\'>' +  trendingData.trends[i].name + '</li>');
        if(i === trendingData.trends.length - 1) {
          $('#trending li a').on('click', function(e){
          console.log('!!! ', $(e.target).text());
          e.preventDefault();
          $('form').find('input[type=text]').val($(e.target).text())
            var searchValue = $('form').find('input').val();
            socket.emit('search', {search: searchValue}, function(data) {
            console.log(data);
          });
        });
        }
      }
    });
  }, "jsonp");
  socket.on('tweet', function (tweet) {

    if(tweet.location) {
      var lat = tweet.location[0];
      var lon = tweet.location[1];
      var latLon = new google.maps.LatLng(lat,lon);
      var marker = new google.maps.Marker({
        position: latLon,
        title: tweet.body,
        map: map
      });

    var infowindow = new google.maps.InfoWindow({
      content: JSON.stringify(tweet)
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });

    }
    //socket.emit('my other event', { my: 'data' });
  });


    $('input[type="submit"]').on('click', function(e){
      e.preventDefault();
       var searchValue = $('form').find('input').val();
       socket.emit('search', {search: searchValue}, function(data) {
        console.log(data);
      });
   });

  var btnStop = document.getElementById('btn-stop');
  btnStop.addEventListener('click', function(event){
    event.preventDefault();
    console.log('!! ', event.target);
    // this shiz isn't working
    socket.emit('pause', null, function(data) {
      console.log(data);
    });

  });



});



