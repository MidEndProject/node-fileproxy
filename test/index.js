"use strict";

var should  = require('chai').should();
var net     = require('net');
var mime    = require('mime');
var http    = require('http');
var https   = require('https');
var proxy   = require('../index.js');
var express = require('express');

// get random port. start form 8000
var portrange  = 8000;
var randomPort = function(callback) {
  var port = portrange;
  portrange += 1;

  var server = net.createServer();

  server.listen(port, function(err) {
    server.once('close', function() {
      callback(port)
    });
    server.close();
  });

  server.on('error', function (err) {
    getPort(callback);
  });
};

describe('#test using http', function() {
  var port = null;
  randomPort(function(port) {
    port = port;
  });

  http.createServer(function(request, response) {
    proxy.serve('https://raw.githubusercontent.com', request, response);
  }).listen(port);

  it('get https://raw.githubusercontent.com/fitraditya/node-fileproxy/master/README.md', function() {
    var options = {
      agent : false,
      host  : 'http://localhost:' + port,
      path  : '/fitraditya/node-fileproxy/master/README.md'
    };

    http.get(
      options
    ).on('response', function(result) {
      var status   = result.statusCode;
      var type     = mime.lookup(host + path);

      status.should.equal(200);
      type.should.equal('text/x-markdown');
    }).on('error', function(error) {
      var status = 500;
      var type   = null;

      status.should.equal(200);
      type.should.equal('text/x-markdown');
    });
  });
});

describe('#test using expressjs', function() {
  var port = null;
  randomPort(function(port) {
    port = port;
  });

  var app = express();

  app.route('/:user/:repo/:branch/*').get(
    proxy.serveExpress('https://raw.githubusercontent.com', function(result, error) {
      console.log(result);
    })
  );

  app.listen(port);

  it('get https://raw.githubusercontent.com/fitraditya/node-fileproxy/master/README.md', function() {
    var options = {
      agent : false,
      host  : 'http://localhost:' + port,
      path  : '/fitraditya/node-fileproxy/master/README.md'
    };

    http.get(
      options
    ).on('response', function(result) {
      var status   = result.statusCode;
      var type     = mime.lookup(host + path);

      status.should.equal(200);
      type.should.equal('text/x-markdown');
    }).on('error', function(error) {
      var status = 500;
      var type   = null;

      status.should.equal(200);
      type.should.equal('text/x-markdown');
    });
  });
});