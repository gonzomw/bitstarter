#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var http = require('http');
var urlVar = require('url');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var glb_checkFile = "";
var options = {};

callback = function(response) {

  var str = '';

  var processIt = function () {
    $ =  cheerio.load(str);
    var checks = JSON.parse(fs.readFileSync(glb_checkFile));
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);
 }
  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
        str += chunk;
  });

  //the whole response has been recieved, process it with cheerio
  response.on('end', function () {
       processIt();
  });
}

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
}

var cheerioHtmlPage = function(htmlfile) {
      http.request(options, callback).end();
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var setOptions =  function(sStr) {
      var uData = urlVar.parse(sStr);
      options = {
           host: uData.host,
           path: uData.path
      };
      return sStr;
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', assertFileExists.clone, CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html' , assertFileExists)
	.option('-u, --url <url_path>', 'URI Path to index.html', setOptions)
        .parse(process.argv);

         glb_checkFile = program.checks;
         if(typeof(program.url) != "undefined") {
             cheerioHtmlPage(program.url, glb_checkFile);
         } else {
                var myFile = program.file || HTMLFILE_DEFAULT;
         	var checkJson = checkHtmlFile(myFile, glb_checkFile);
                var outJson = JSON.stringify(checkJson, null, 4);
                console.log(outJson);
         }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}



