var express = require('express');
var app = express();
var bodyParser =  require("body-parser");
var twitter = require('ntwitter');
var streamHandler = require('./lib/twitter-handler');
var config = require('./config');
//var io = require('socket.io').listen(server);
var http = require('http');
var port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

var twit = new twitter(config.twitter);

app.get('/', function(req, res) {
  res.render('index');

});

//app.get('/search', function(req, res) {
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
	// var searchTerm = req.query.search;
  //io.on('connection', function(socket){
	socket.on('search', function(searchTerm){
 		console.log('!! ', searchTerm);
    	twit.stream('statuses/filter', { track: searchTerm.search,  'locations':'-180,-90,180,90'}, function(stream){
    	// streamHandler(stream,io);
    		twit.currentTwitStream = stream;
    		twit.currentTwitStream.on('data', function(data) {

		    // Construct a new tweet object

		    var tweet = {
		      twid: data['id'],
		      active: false,
		      author: data['user']['name'],
		      avatar: data['user']['profile_image_url'],
		      body: data['text'],
		      date: data['created_at'],
		      screenname: data['user']['screen_name'],
		    };

		    if (data['geo']) {
		      tweet['location'] = data['geo']['coordinates'];
		    }

		    io.emit('tweet', tweet);
  		});


 	});

    socket.on('pause', function(socket){
    	twit.currentTwitStream.destroy();
    });
  });
});

// io.on('pause', function(socket){

// });




//});

