var express = require('express');
var phantomExpress = require("phantom-express");
var app = express();
var options = {
    // Currently the middleware caches the response from the
    // phantomjs process in the memory. The parameter defines
    // TTL in seconds. If 0 is passed the cache will be ignored.
    cacheLifetime: 3600,
    // Dump status to the console or not
    verbose: true,
    // Prepends the string to the pretty generated hash
    // ex. if '!' is defined ->  #!/home/page
    hashPrepend: '!'
};

app.use('/views', express.static(__dirname + '/views'));
app.use(express.query());
app.use(phantomExpress(options));

app.get('/', function (req, res) {
    console.log("got request");
    res.sendFile(__dirname + '/index.html')
});

var port = process.env.PORT || 9000;
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Lemonades web-ui listening at http://%s:%s', host, port);
});