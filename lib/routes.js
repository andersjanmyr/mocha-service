'use strict';
var path = require('path');
var async = require('async');
var debug = require('debug')('mocha-service');
var cheerio = require('cheerio');

function routes(app, appRoot, srcPattern, testPattern) {
    appRoot = appRoot || path.resolve(__dirname + '/../../public');
    srcPattern = srcPattern || '/(scripts|!script/test)/**/*.js';
    testPattern = testPattern || '/scripts/test/*.js';
    debug(appRoot, srcPattern, testPattern);

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    function getFiles(pattern, callback) {
        glob(appRoot + pattern, function(err, files) {
            debug(pattern, files);
            var relFiles = files.map(function(file) {
                return file.replace(appRoot, '');
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
        async.map([src + '/*.js', test + '/*.js'], getFiles, function(err, result) {
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

    var modulePath = path.resolve(__dirname + '/../node_modules/');

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

}


module.exports = routes;
