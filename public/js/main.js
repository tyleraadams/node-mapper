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
    $(function(){
        $('input[type="submit"]').on('click', function(e){
          e.preventDefault();
           var searchValue = $('form').find('input').val();
           socket.emit('search', {search: searchValue}, function(data) {
            console.log(data);
          });
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

