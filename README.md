# node-fileproxy

A simple HTTP proxy for serving static files

## Installation

``` bash
  $ [sudo] npm install fileproxy
```

## Usage

### Using node http

#### fileproxy.server()

```
var http  = require('http');
var proxy = require('../index.js');

var host  = 'https://raw.githubusercontent.com';

var server = http.createServer(function(request, response) {
  proxy.serve(host, request, response, function(result, error) {  // callback is optional
    console.log(result);                                          // it will return http response status and mime type for result, and http response status for error
  });
});

server.listen(8000);
```

Open `http://localhost:8000/MidEndProject/node-fileproxy/master/README.md` in your browser. You will see a README file that gets from `https://raw.githubusercontent.com/indexzero/node-portfinder/master/README.md`.
Note that `node fileproxy` will return file with mime type based on its file extension, so use it only for proxying a static file.

## To Do
* Express
* Koa

## Maintainer
[Fitra Aditya][0]

## License
MIT

[0]: https://github.com/fitraditya