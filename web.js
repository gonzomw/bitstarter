var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());
var infile = "index.html";
var contactfname = "contact.html";
app.get('/', function(request, response) {
  response.send(buf.toString());
});
app.get('/contact/', function(request, response) {
  response.send(contactBuf.toString());
});

var buf = new Buffer(fs.readFileSync(infile));
var contactBuf = new Buffer(fs.readFileSync(contactfname));

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
