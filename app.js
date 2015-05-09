var express = require('express');
var request = require('sync-request');
var url = require('url');
var app = express();
var options = {
    // Currently the middleware caches the response from the
    // phantomjs process in the memory. The parameter defines
    // TTL in seconds. If 0 is passed the cache will be ignored.
    cacheLifetime: 0,
    // Dump status to the console or not
    verbose: true,
    // Prepends the string to the pretty generated hash
    // ex. if '!' is defined ->  #!/home/page
    hashPrepend: '!'
};

app.use('/views', express.static(__dirname + '/views'));
app.use(express.query());
//app.use(phantomExpress(options));



app.get('/', function (req, res) {
    console.log("got request", req.query._escaped_fragment_);
    if (typeof(req.query._escaped_fragment_) !== "undefined" && req.query._escaped_fragment_.indexOf('group')>-1) {
        console.log("rendering at the server end");
        var response = request('GET', 'http://lemonades.elasticbeanstalk.com/api/v1'+req.query._escaped_fragment_.split("?")[0] + '/share');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(response.getBody());
        res.end();

    }else {
        res.sendFile(__dirname + '/index.html')
    }
});

app.get('/group/:id/share',function(req,res){
    console.log("handling it");
    console.log(req.url);
    var url_parts = url.parse(req.url, true);
    console.log(url_parts.query);
    var path = "http://www.lemonades.in/#!/group/"+req.params.id;
    if (req.url.split('?').length>1){
        path += "?" +req.url.split('?')[1];
    }
    res.writeHead(302, {'Location': path});
    res.end();
});


app.get('/group/:id/share/gplus',function(req,res){
    if (typeof(req.query._escaped_fragment_) !== "undefined"){
        console.log("git gplus escape fragment query");
    }
    var response = request('GET', 'http://lemonades.elasticbeanstalk.com/api/v1/group/'+req.params.id + '/share');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(response.getBody());
    res.end();
});


var port = process.env.PORT || 9000;
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Lemonades web-ui listening at http://%s:%s', host, port);
});