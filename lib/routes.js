'use strict';
var path = require('path');
var async = require('async');
var debug = require('debug')('mocha-service');
var cheerio = require('cheerio');
var glob = require('glob');
var fs = require('fs');
var util = require('util');
var ejs = require('ejs');

function routes(app, options) {
    if (!options) options = {};
    options.appRoot = options.appRoot || path.resolve(__dirname + '/../../public');
    options.srcPattern = options.srcPattern || '/scripts/*.js';
    options.testPattern = options.testPattern || '/scripts/test/*.js';
    options.libPattern = options.libPattern || '/scripts/lib/*.js';
    options.cssPattern = options.cssPattern || '/stylesheets/*.css';
    options.globals = options.globals || [];
    options.appFile = options.appFile || null;
    debug(util.inspect(options));

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/../views');

    function getFiles(pattern, callback) {
        glob(options.appRoot + pattern, function(err, files) {
            debug(pattern, files);
            var relFiles = files.map(function(file) {
                return file.replace(options.appRoot, '');
            });
            callback(err, relFiles);
        });
    }

    function getIndexBody(callback) {
        if (!options.appFile)
            return process.nextTick(function() {
                return callback(null, '');
            });
        var indexFile = options.appRoot + options.appFile;
        fs.readFile(indexFile, function(err, data) {
            if (err)
                return callback('Error loading file: ' + indexFile + '\n' + err);
            var $ = cheerio.load(data);
            callback(null, $('body').html());
        });
    }

    app.get('(/test|/test/index.html)', function(req, resp) {
        var patterns = [options.srcPattern, options.testPattern,
            options.libPattern, options.cssPattern];
        async.map(patterns, getFiles, function(err, result) {
            if (err) throw err;
            getIndexBody(function(err, body) {
                resp.render('index', {
                    srcFiles: result[0],
                    testFiles: result[1],
                    libFiles: result[2],
                    cssFiles: result[3],
                    globals: JSON.stringify(options.globals),
                    body: body
                });
            });
        });
    });

    var modulePath = path.resolve(__dirname + '/../node_modules/');

    function sendModuleFile(resp, file) {
        resp.sendfile(file, {root: modulePath});
    }

    app.get('/test/mocha.js', function(req, resp) {
        sendModuleFile(resp, 'mocha/mocha.js');
    });

    app.get('/test/mocha.css', function(req, resp) {
        sendModuleFile(resp, 'mocha/mocha.css');
    });

    app.get('/test/chai.js', function(req, resp) {
        sendModuleFile(resp, 'chai/chai.js');
    });

}


module.exports = routes;
