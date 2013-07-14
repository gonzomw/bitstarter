var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());
var infile = "index.html";
app.get('/', function(request, response) {
  response.send(buf.toString());
});

var buf = new Buffer(fs.readFileSync(infile));

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
