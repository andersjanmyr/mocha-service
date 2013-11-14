'use strict';
var path = require('path');
var async = require('async');
var debug = require('debug')('mocha-service');
var cheerio = require('cheerio');
var glob = require('glob');
var fs = require('fs');
var util = require('util');
var ejs = require('ejs');

function defaultOptions(options) {
    options.appRoot = options.appRoot || path.resolve(__dirname + '/../../public');
    options.srcPattern = options.srcPattern || '/scripts/*.js';
    options.testPattern = options.testPattern || '/scripts/test/*.js';
    options.libPattern = options.libPattern || '/scripts/lib/*.js';
    options.cssPattern = options.cssPattern || '/stylesheets/*.css';
    options.globals = options.globals || [];
    options.appFile = options.appFile || null;
    debug(util.inspect(options));
}

/*
 * Sets up the tests under `/test/index.html`
 * app An instance of an Express application.
 * options
 *  appRoot: The path to the directory with the client files (./public)
 *  appFile: The URL of an html file to include the body of *  (null)
 *  srcPattern: Glob pattern to find source files (/scripts/*.js)
 *  testPattern: Glob pattern to find test files (/scripts/test/*.js)
 *  libPattern: Glob pattern to find lib files (/scripts/lib/*.js)
 *  globals: Global variables that mocha ignores
 */
function routes(app, options) {
    if (!options) options = {};
    defaultOptions(options);

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
                return callback('Error loading file: ' + indexFile + '\n' + err); var $ = cheerio.load(data);
            callback(null, $('body').html());
        });
    }

    app.get('(/test|/test/index.html)', function(req, resp) {
        var patterns = [options.srcPattern, options.testPattern,
            options.libPattern, options.cssPattern];
        async.map(patterns, getFiles, function(err, result) {
            if (err) throw err;
            getIndexBody(function(err, body) {
                var view = __dirname + '/../views/index.ejs';
                var data = {
                    srcFiles: result[0],
                    testFiles: result[1],
                    libFiles: result[2],
                    cssFiles: result[3],
                    globals: JSON.stringify(options.globals),
                    body: body
                };
                ejs.renderFile(view, data, function(err, data) {
                    if (err) throw err;
                    resp.send(data);
                });
            });
        });
    });

    var nodeModulesPaths = [
        path.resolve(__dirname + '/../node_modules/'),
        path.resolve(__dirname + '/../../node_modules/'),
        path.resolve(__dirname + '/../../../node_modules/')
    ];


    function findFile(filename, callback) {
        var filenames = nodeModulesPaths.map(function(path) {
            return path + '/' + filename;
        });

        async.detect(filenames, fs.exists, function(path) {
            if (!path) callback('Cannot find ' + filename);
            return callback(null, path.replace(filename, ''));
        });
    }

    function sendModuleFile(resp, file) {
        findFile(file, function(err, nodeModulesPath) {
            if (err)
                return resp.send(500, err);
            resp.sendfile(file, {root: nodeModulesPath});
        });
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
