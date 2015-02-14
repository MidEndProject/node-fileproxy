# node-fileproxy

[![Build Status](https://travis-ci.org/MidEndProject/node-fileproxy.svg?branch=master)](https://travis-ci.org/MidEndProject/node-fileproxy)

A simple HTTP proxy for serving static files

## Installation

``` bash
  $ [sudo] npm install fileproxy
```

## Usage

### Using http

#### fileproxy.server()

``` javascript
var http      = require('http');
var fileproxy = require('fileproxy');

var host  = 'https://raw.githubusercontent.com';

var server = http.createServer(function(request, response) {
  fileproxy.serve(host, request, response, function(result, error) {
    console.log(result);
  });
});

server.listen(8000);
```

### Using Expressjs

#### fileproxy.serverExpress

``` javascript
var http      = require('http');
var fileproxy = require('fileproxy');

var app   = express();
var host  = 'https://raw.githubusercontent.com';

app.route('/:user/:repo/:branch/*').get(
  fixy.serveExpress(host, function(result, error) {
    console.log(result);
  })
);

app.listen(8000);
```


Callback is optional. It will return http response status and mime type for result, and http response status for error.

Open `http://localhost:8000/MidEndProject/node-fileproxy/master/README.md` in your browser. You will see a README file that gets from `https://raw.githubusercontent.com/indexzero/node-portfinder/master/README.md`.
Note that `node fileproxy` will return file with mime type based on its file extension, so use it only for proxying a static file.

## To Do
* Koa

## Maintainer
[Fitra Aditya][0]

## License
MIT

[0]: https://github.com/fitraditya
