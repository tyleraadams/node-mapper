module.exports = function(stream, io){

  // When tweets get sent our way ...
  stream.on('data', function(data) {

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
    console.log( 'tweet ' + JSON.stringify(tweet));
    io.emit('tweet', tweet);

    io.on('connection', function (socket) {
      console.log('connected bitch')
    socket.on('disconnect', function(){
      stream.destroy();

    });
  });
  });


};
