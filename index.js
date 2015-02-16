var express = require('express');
var app = express();
var bodyParser =  require("body-parser");
var twitter = require('ntwitter');
var streamHandler = require('./lib/twitter-handler');
var config = require('./config');
var io = require('socket.io').listen(server);
var http = require('http');
var port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

var twit = new twitter(config.twitter);

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  console.log('Search term: ' + req.body.searchTerm);
  var searchTerm = req.body.searchTerm;

  twit.stream('statuses/filter',{  'locations':'-180,-90,180,90'}, function(stream){
  streamHandler(stream,io);
});

});

var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});