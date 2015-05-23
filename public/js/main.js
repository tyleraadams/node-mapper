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
    console.log(tweet.location);
    if(tweet.location) {
      var lat = tweet.location[0];
      var lon = tweet.location[1];
      var latLon = new google.maps.LatLng(lat,lon);
      var marker = new google.maps.Marker({
        position: latLon,
        title: 'Hello World!',
        map: map
      });

    }
    //socket.emit('my other event', { my: 'data' });
  });

  var btnStop = document.getElementById('btn-stop');
  btnStop.addEventListener('click', function(event){
    console.log('!! ', event.target);
    // this shiz isn't working
    socket.emit('pause', null, function(data) {
    console.log(data);
    });
  });
});

