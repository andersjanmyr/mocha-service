'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var async = require('async');
var cheerio = require('cheerio');

var app = express();

if ('test' !== app.get('env')) {
    console.log('Test server must run with NODE_ENV=test');
    process.exit(1);
}


// all environments
app.set('port', process.env.PORT || 9002);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.favicon());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.errorHandler());

app.get('/status', function(req, resp) {
    resp.send('Test Server is up and running');
});


var appDir = path.resolve(__dirname + '/../../app');

function getFiles(pattern, callback) {
    glob(appDir + pattern, function(err, files) {
        var relFiles = files.map(function(file) {
            return file.replace(appDir, '');
        });
        callback(err, relFiles);
    });
}

function getIndexBody(callback) {
    fs.readFile(appDir + '/index.html', function(err, data) {
        if (err) return callback(err);
        var $ = cheerio.load(data);
        callback(null, $('body').html());
    });
}

app.get('(/|/index.html)', function(req, resp) {
    async.map(['/scripts/*.js', '/scripts/test/*.js'], getFiles, function(err, result) {
        if (err) throw err;
        getIndexBody(function(err, body) {
            console.log(body, 'body');
            resp.render('index', {
                srcFiles: result[0],
                testFiles: result[1],
                body: body
            });
        });
    });
});

var modulePath = path.resolve(__dirname + '/../../node_modules/');

function sendModuleFile(resp, file) {
    resp.sendfile(file, {root: modulePath});
}

app.get('/mocha.js', function(req, resp) {
    sendModuleFile(resp, 'mocha/mocha.js');
});

app.get('/mocha.css', function(req, resp) {
    sendModuleFile(resp, 'mocha/mocha.css');
});

app.get('/chai.js', function(req, resp) {
    sendModuleFile(resp, 'chai/chai.js');
});

app.use(express.static(__dirname + '/../../app'));

http.createServer(app).listen(app.get('port'), function(){
    console.log(app.get('env').toUpperCase() + ' server started on port ' + app.get('port'));
});



