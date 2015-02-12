"use strict";

var url   = require('url');
var mime  = require('mime');
var https = require('https');
var zlib  = require('zlib');

var FileProxy = function() {};

FileProxy.prototype.serve = function(domain, request, response) {
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

  https.get(
    options
  ).on('response', function(result) {
    var status   = result.statusCode;
    var encoding = result.headers['content-encoding'];
    var type     = mime.lookup(host + path);

    if (status === 304) {
      response.statusCode = 304;
      response.end();
    } else if (status === 404) {
      response.statusCode = 404;
      response.end();
    } else if (status !== 200) {
      response.statusCode = 500;
      response.end();
    } else {
      response.statusCode = status;
      response.setHeader('Content-Type', type);

      if ((encoding === 'gzip' || encoding === 'deflate')
          && request.acceptsEncodings(encoding) !== encoding) {
        result.pipe(zlib.createUnzip()).pipe(response, { end: true });
      } else {
        result.pipe(response, { end: true });
      }
    }
  }).on('error', function(error) {
    response.statusCode = 500;
    response.end()
  });
};

module.exports = new FileProxy;