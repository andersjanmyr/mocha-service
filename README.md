# Mocha Service

An Express service that can be used for testing client side applications with
Mocha and Chai.

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


