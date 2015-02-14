"use strict";

var url   = require('url');
var mime  = require('mime');
var https = require('https');
var zlib  = require('zlib');

var FileProxy = function() {};

FileProxy.prototype.serve = function(domain, request, response, callback) {
  var headers = {}

  headers['accept-encoding'] = 'gzip,deflate';

  var proto = url.parse(domain).protocol;
  var host  = url.parse(domain).host;
  var path  = url.parse(request.url).pathname;

  var options = {
    agent : false,
    host  : host,
    path  : path
  };

  if (proto === 'http:') {
    http.get(
      options
    ).on('response', function(result) {
      onResponse(options, result, response, callback);
    }).on('error', function() {
      onError(response, callback);
    });
  } else if (proto === 'https:') {
    https.get(
      options
    ).on('response', function(result) {
      onResponse(options, result, response, callback);
    }).on('error', function(error) {
      onError(response, callback);
    });
  } else {
    onError(response, callback);
  }
};

FileProxy.prototype.serveExpress = function(domain, callback) {
  return function (request, response) {
    var headers = {}

    headers['accept-encoding'] = 'gzip,deflate';

    var proto = url.parse(domain).protocol;
    var host  = url.parse(domain).host;
    var path  = url.parse(request.path).pathname;

    var options = {
      agent : false,
      host  : host,
      path  : path
    };

    if (proto === 'http:') {
      http.get(
        options
      ).on('response', function(result) {
        onResponse(options, result, response, callback);
      }).on('error', function() {
        onError(response, callback);
      });
    } else if (proto === 'https:') {
      https.get(
        options
      ).on('response', function(result) {
        onResponse(options, result, response, callback);
      }).on('error', function() {
        onError(response, callback);
      });
    } else {
      onError(response, callback);
    }
  }
};

var onResponse = function(options, result, response, callback) {
  var status   = result.statusCode;
  var encoding = result.headers['content-encoding'];
  var type     = mime.lookup(options.host + options.path);

  if (status === 304) {
    response.statusCode = 304;
    response.end();

    if (callback) callback(null, 304);
  } else if (status === 404) {
    response.statusCode = 404;
    response.write('Error 404: Not found');
    response.end();

    if (callback) callback(null, 404);
  } else if (status !== 200) {
    response.statusCode = 500;
    response.end();

    if (callback) callback(null, 500);
  } else {
    response.statusCode = status;
    response.setHeader('Content-Type', type);

    if ((encoding === 'gzip' || encoding === 'deflate')
        && request.acceptsEncodings(encoding) !== encoding) {
      result.pipe(zlib.createUnzip()).pipe(response, { end: true });
    } else {
      result.pipe(response, { end: true });
    }

    if (callback) callback({ status: status, type: type }, null);
  }
};

var onError = function(response, callback) {
  response.statusCode = 500;
  response.end();

  if (callback) callback(null, 500);
};

module.exports = new FileProxy;