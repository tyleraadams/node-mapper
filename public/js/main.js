function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(51.508742,-0.120850),
    zoom:5,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

document.addEventListener("DOMContentLoaded", function(event) {
  google.maps.event.addDomListener(window, 'load', initialize);
  // var socket = io.connect('http://localhost');
  // socket.on('tweet', function (data) {
    // console.log(data);
    // socket.emit('my other event', { my: 'data' });
  // });
});

