# Mocha Service

An Express service that can be used for testing client side applications with
Mocha and Chai.

[![Build Status](https://travis-ci.org/andersjanmyr/mocha-service.png)](https://travis-ci.org/andersjanmyr/mocha-service)

The service dynamically creates the Mocha `test.html` file. The file can be
accessed at `http://localhost:9002/test/index.html` (or whatever port you
choose to run it on).

If you want to run the test in a command line interface, I recommend
[mocha-phantom-js](https://github.com/metaskills/mocha-phantomjs).

## Usage Embedded

`mochaService` sets up the tests under `/test/index.html`

```javascript
var app = express();

if (app.get('env') === 'test') {
  var mochaService = require('mocha-service');
  mochaService(app, {
      appRoot: path.join(__dirname, 'app'),
      appFile: '/index.html',
      srcPattern: '/assets/scripts/*.js',
      testPattern: '/assets/scripts/test/*.js',
      libPattern: '/assets/scripts/lib/*.js',
      cssPattern: '/assets/stylesheets/*.css',
      globals: ['$']
  });
}
```

Available options to `mochaService` are:

 * `app` An instance of an Express application.
 * `options`
 *  `appRoot`: The path to the directory with the client files (./public)
 *  `appFile`: The URL of an html file to include the body of *  (null)
 *  `srcPattern`: Glob pattern to find source files (/scripts/*.js)
 *  `testPattern`: Glob pattern to find test files (/scripts/test/*.js)
 *  `libPattern`: Glob pattern to find lib files (/scripts/lib/*.js)
 *  `globals`: Global variables that mocha ignores


## Usage standalone

```sh
$ bin/mocha-service --help
Starts a client test server.
Usage: node ./bin/mocha-service

Options:
  --help     This information
  --root     The root directory of the client files (./public)
  --src      Glob pattern for source files (/scripts/*.js)
  --test     Glob pattern for test files (/scripts/test/*.js)
  --lib      Glob pattern for lib files (/scripts/lib/*.js)
  --css      Glob pattern for css files (/stylesheets/*.css)
  --globals  Globals mocha should ignore (none)
  --html     A html file whose body will be included in the file (none)
  --port     The port of the server (env.PORT || 9002)
```

