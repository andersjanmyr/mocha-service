'use strict';

var request = require('supertest');
var sinon = require('sinon');
var expect = require('chai').expect;

var express = require('express');
var routes = require('../lib/routes');

var app = express();

routes(app, {
    appRoot: __dirname + '/fixtures',
    globals: ['$']
});

describe('routes', function() {
    describe('GET /mocha.js', function(){
        it('responds with 200', function(done){
            request(app)
                .get('/test/mocha.js')
                .expect(200)
                .end(done);
        });
    });

    describe('GET /mocha.css', function(){
        it('responds with 200', function(done){
            request(app)
                .get('/test/mocha.js')
                .expect(200)
                .end(done);
        });
    });
    describe('GET /chai.css', function(){
        it('responds with 200', function(done){
            request(app)
                .get('/test/mocha.js')
                .expect(200)
                .end(done);
        });
    });
    describe('GET /test/index.html', function(){
        it('responds with 200', function(done){
            request(app)
                .get('/test/index.html')
                .expect(200)
                .end(function(err, resp) {
                    expect(resp.text).to.match(/tapir\.js/);
                    expect(resp.text).to.match(/tapir-test\.js/);
                    expect(resp.text).to.match(/jquery\.js/);
                    expect(resp.text).to.match(/\[\"\$\"\]/);
                    done();
                });
        });

    });
});
