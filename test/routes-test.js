'use strict';

var request = require('supertest');
var sinon = require('sinon');
var expect = require('chai').expect;

var express = require('express');
var routes = require('../lib/routes');

var app = express();

routes(app, __dirname + '/fixtures');

describe('routes', function() {
    describe('GET /mocha.js', function(){
        it('responds with 200', function(done){
            request(app)
                .get('/mocha.js')
                .expect(200)
                .end(done);
        });
    });

    describe('GET /mocha.css', function(){
        it('responds with 200', function(done){
            request(app)
                .get('/mocha.js')
                .expect(200)
                .end(done);
        });
    });
    describe('GET /chai.css', function(){
        it('responds with 200', function(done){
            request(app)
                .get('/mocha.js')
                .expect(200)
                .end(done);
        });
    });
});
