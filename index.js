var express = require('express');
var app = express();
var bodyParser =  require("body-parser");
var twitter = require('twit');
var streamHandler = require('./lib/twitter-handler');
var config = require('./config');
//var io = require('socket.io').listen(server);
var http = require('http');
var port = process.env.PORT || 8080;
var cache = {};

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static(__dirname + '/public'));

var twit = new twitter(config.twitter);

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/location', function(req, res) {
  console.log('req: ', req.body);
  twit.get('/trends/place', {'id': 1}, function(err, data){
  	console.log(data);
  	if (err) return console.error(err);
  	if ( cache['trending'] === undefined) {
		cache['trending'] = data[0];
  	}

  	res.send(cache['trending']);
  	io.on('connection', function(socket){
	// var searchTerm = req.query.search;
  //io.on('connection', function(socket){
	socket.on('search', function(searchTerm){
    	twit.stream('statuses/filter', { track: searchTerm.search}, function(stream){
    	// streamHandler(stream,io);
    		twit.currentTwitStream = stream;
    		twit.currentTwitStream.on('data', function(data) {

		    // Construct a new tweet object
		    //console.log(data);
		    var tweet = {
		      twid: data['id'],
		      author: data['user']['name'],
		      avatar: data['user']['profile_image_url'],
		      body: data['text'],
		      date: data['created_at'],
		      screenname: data['user']['screen_name'],
		    };
		    //console.log('does it contain the search term?   ', tweet.body.indexOf(searchTerm) > -1)
			// need to make a case for location
			if (data['place']) {
				//console.log ('LOCATION: ', data['place'].bounding_box.coordinates[0][0]);
				var location =  data['place'].bounding_box.coordinates[0];
				var avg1 = 0;
				var avg2 = 0;
				for(var i =0; i < location.length; i++) {
				  avg1+=location[i][0];
				  avg2+=location[i][1];
				  if (i === location.length - 1) { avg1 = avg1/location.length; avg2 = avg2/location.length; }
				}
				tweet['location'] = [avg2, avg1]; //location.map(function(val,index){if(index === 0){return location[index+1]} else {return location[index-1]}});
			}

			if (data['geo']) {
		      tweet['location'] = data['geo']['coordinates'];
		    }

		    if (tweet['location']) {
		    	io.emit('tweet', tweet);
		    } else {
		    	console.log('no geotag ', tweet);
		    }


  		});


 	});

    socket.on('pause', function(){
    	twit.currentTwitStream.destroy();
    });

  });
});

  });
});

//app.get('/search', function(req, res) {
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

var io = require('socket.io')(server);


// io.on('pause', function(socket){

// });




//});

