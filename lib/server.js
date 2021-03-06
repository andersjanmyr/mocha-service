'use strict';

var express = require('express');
var http = require('http');
var routes = require('./routes');


function server(options) {
    var app = express();

    var port = options.port;
    delete options.port;

    routes(app, options);

    if ('test' !== app.get('env')) {
        console.log('Test server must run with NODE_ENV=test');
        process.exit(1);
    }

    // all environments
    app.set('port', port || process.env.PORT || 9002);
    app.use(express.logger('dev'));
    app.use(express.favicon());
    app.use(express.json());
    app.use(express.methodOverride());
    app.use(express.errorHandler());

    app.get('/status', function(req, resp) {
        resp.send('Test Server is up and running');
    });


    http.createServer(app).listen(app.get('port'), function(){
        console.log(app.get('env').toUpperCase() + ' server started on port ' + app.get('port'));
    });
}

module.exports = server;
