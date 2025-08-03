========================
CODE SNIPPETS
========================
TITLE: Install Dependencies for Express.js Repository Examples
DESCRIPTION: Command to install Node.js package dependencies required for running examples within the cloned Express.js repository.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_7

LANGUAGE: bash
CODE:
```
npm install
```

----------------------------------------

TITLE: Run an Express.js Example
DESCRIPTION: Command to execute a specific example file from the Express.js repository using Node.js.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_8

LANGUAGE: bash
CODE:
```
node examples/content-negotiation
```

----------------------------------------

TITLE: Start Express.js Application Server
DESCRIPTION: Command to start the web server for a generated Express.js application.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_5

LANGUAGE: bash
CODE:
```
npm start
```

----------------------------------------

TITLE: Install Express Benchmark Dependencies
DESCRIPTION: Installs the necessary Node.js dependencies for running the Express.js benchmarks using npm. This command should be executed in the project's root directory before running any benchmarks.

SOURCE: https://github.com/expressjs/express/blob/master/benchmarks/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
npm i
```

----------------------------------------

TITLE: Install Node.js Module via npm
DESCRIPTION: This command demonstrates how to install a Node.js module using the npm package manager. Users should replace 'module-name' with the actual name of the module they wish to install. This is typically the first step to using a new module.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/README-template.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ npm install module-name
```

----------------------------------------

TITLE: Install Express.js via npm
DESCRIPTION: Command to install the Express.js framework as a dependency in a Node.js project using npm.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm install express
```

----------------------------------------

TITLE: Install Express.js Application Generator
DESCRIPTION: Command to globally install the `express-generator` utility, which helps scaffold Express.js applications.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm install -g express-generator@4
```

----------------------------------------

TITLE: Install Dependencies for Generated Express.js App
DESCRIPTION: Command to install Node.js package dependencies for an Express.js application after it has been generated.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_4

LANGUAGE: bash
CODE:
```
npm install
```

----------------------------------------

TITLE: Create a Basic Express.js Web Server
DESCRIPTION: Demonstrates how to set up a simple Express.js application, define a route for the root path, and start the server on port 3000.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(3000)
```

----------------------------------------

TITLE: Install Dependencies for Express.js Tests
DESCRIPTION: Command to install Node.js package dependencies required to run the test suite for Express.js.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_9

LANGUAGE: bash
CODE:
```
npm install
```

----------------------------------------

TITLE: Run Express Benchmarks
DESCRIPTION: Executes the Express.js benchmark suite using the `make` command. This command assumes that `wrk` is installed and all Node.js dependencies have been set up.

SOURCE: https://github.com/expressjs/express/blob/master/benchmarks/README.md#_snippet_2

LANGUAGE: Shell
CODE:
```
make
```

----------------------------------------

TITLE: CSS Styling for Search Example Body
DESCRIPTION: This CSS snippet defines the basic styling for the `body` element of a web page, specifically for a search example. It sets the font to 'Helvetica Neue' or 'Helvetica' at 14 pixels and applies a 50-pixel padding around the content.

SOURCE: https://github.com/expressjs/express/blob/master/examples/search/public/index.html#_snippet_0

LANGUAGE: CSS
CODE:
```
body { font: 14px "Helvetica Neue", Helvetica; padding: 50px; }
```

----------------------------------------

TITLE: Express 4 Removed Bundled Middleware
DESCRIPTION: Lists middleware previously bundled with Express 3.x that are now separate modules in Express 4.0, requiring explicit installation and usage.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
bodyParser: body-parser (https://github.com/expressjs/body-parser)
cookieParser: cookie-parser (https://github.com/expressjs/cookie-parser)
favicon: serve-favicon (https://github.com/expressjs/serve-favicon)
session: express-session (https://github.com/expressjs/session)
```

----------------------------------------

TITLE: Install Eson Library via npm
DESCRIPTION: This snippet demonstrates the command-line instruction to install the `eson` library as a dependency in your Node.js project. The `--save` flag ensures that `eson` is added to your project's `package.json` file.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/ESON-JSON-Configuration.md#_snippet_0

LANGUAGE: Bash
CODE:
```
$ npm install eson --save
```

----------------------------------------

TITLE: Example Express Benchmark Output
DESCRIPTION: Illustrates the typical output format when running Express.js benchmarks, showing performance metrics like connections, middleware count, and execution times for different test scenarios.

SOURCE: https://github.com/expressjs/express/blob/master/benchmarks/README.md#_snippet_0

LANGUAGE: Text
CODE:
```
  50 connections
  1 middleware
 7.15ms
 6784.01

 [...redacted...]

  1000 connections
  10 middleware
 139.21ms
 6155.19
```

----------------------------------------

TITLE: Express 3.x Global Error Handling Middleware Example
DESCRIPTION: This example illustrates how to implement a global error-handling middleware in Express 3.x. By defining a middleware function with four arguments (`err, req, res, next`) and placing it at the end of the middleware stack, it can catch errors passed via `next(err)` from preceding middleware. This allows for centralized error response handling, such as sending a 500 status with a custom error message.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_9

LANGUAGE: javascript
CODE:
```
app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.session())
app.use(app.router) // the router itself (app.get(), app.put() etc)
app.use(function(err, req, res, next){
  // if an error occurs Connect will pass it down
  // through these "error-handling" middleware
  // allowing you to respond however you like
  res.send(500, { error: 'Sorry something bad happened!' });
})
```

----------------------------------------

TITLE: Clone Express.js GitHub Repository
DESCRIPTION: Command to clone the Express.js source code repository from GitHub for development or example exploration.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_6

LANGUAGE: bash
CODE:
```
git clone https://github.com/expressjs/express.git --depth 1 && cd express
```

----------------------------------------

TITLE: Run Benchmarks and Display Node.js Version
DESCRIPTION: Executes the Express.js benchmarks and then prints the installed Node.js version to the console. This is useful for tracking performance across different Node.js environments or for debugging version-specific issues.

SOURCE: https://github.com/expressjs/express/blob/master/benchmarks/README.md#_snippet_3

LANGUAGE: Shell
CODE:
```
make && node -v
```

----------------------------------------

TITLE: Setting up HTTP and HTTPS Servers with Express Application
DESCRIPTION: Demonstrates how to create separate HTTP and HTTPS servers using Node.js's native `http.createServer()` and `https.createServer()` functions. The Express application instance is passed to these server creators, allowing for flexible server configurations.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_2

LANGUAGE: js
CODE:
```
var app = express();
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
```

----------------------------------------

TITLE: Migrating app.configure() to environment checks
DESCRIPTION: Demonstrates how to replace the deprecated `app.configure()` method with a standard `if` statement checking `process.env.NODE_ENV` for environment-specific configurations in Express 4.0.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
app.configure('development', function() {
   // configure stuff here
});
// becomes
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   // configure stuff here
}
```

----------------------------------------

TITLE: Equivalence of `app.listen()` and `http.createServer()` in Express
DESCRIPTION: Illustrates that `app.listen()` is a convenience method provided by Express that internally wraps the application in an HTTP server. For more control or specific server configurations, explicitly using `http.createServer()` is equivalent and often necessary.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_3

LANGUAGE: js
CODE:
```
var app = express();
app.listen(3000);
```

LANGUAGE: js
CODE:
```
var app = express()
  , http = require('http');

http.createServer(app).listen(3000);
```

----------------------------------------

TITLE: Express 4 app.route vs app.mountpath for Mounting Apps
DESCRIPTION: Clarifies the change from `app.route` to `app.mountpath` when mounting one Express application within another.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_9

LANGUAGE: APIDOC
CODE:
```
app.route -> app.mountpath: Used when mounting an Express app within another Express app.
```

----------------------------------------

TITLE: Using app.use with route parameters in Express 4
DESCRIPTION: Shows how `app.use` in Express 4.0 now supports route parameters, allowing middleware to be applied to specific parameterized paths and access `req.params`.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
app.use('/users/:user_id', function(req, res, next) {
  // req.params.user_id exists here
});
```

----------------------------------------

TITLE: Express 3.x Deprecated Methods in 4.x
DESCRIPTION: A list of methods and properties deprecated in Express 4.x, requiring updates when upgrading from 3.x. Users should refer to the suggested alternatives.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_17

LANGUAGE: APIDOC
CODE:
```
Deprecated since 3.x (affecting 4.x upgrade):
- `app.param(name, fn)`: Deprecate leading `:` in `name`
- `req.param()`: Use `req.params`, `req.body`, or `req.query`
- `app.param(fn)`
- `res.sendfile`: Use `res.sendFile`
- `res.json(status, obj)`: Use `res.status(status).json(obj)`
- `res.jsonp(status, obj)`: Use `res.status(status).jsonp(obj)`
- `res.json(obj, status)`: Use `res.status.json(obj)`
  - Edge case `res.json(status, num)`: Use `res.status(status).json(num)`
- `res.jsonp(obj, status)`: Use `res.status(status).jsonp(obj)`
- `res.send(status, body)`: Use `res.status(status).send(body)`
- `res.redirect(url, status)`: Use `res.redirect(status, url)`
- `req.host`: Use `req.hostname`
- `app.del()`: Use `app.delete()`
```

----------------------------------------

TITLE: Express 4 json spaces Configuration Change
DESCRIPTION: Highlights that the `json spaces` setting is no longer enabled by default in development environments in Express 4.0.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_10

LANGUAGE: APIDOC
CODE:
```
json spaces: No longer enabled by default in development.
```

----------------------------------------

TITLE: Express `res.locals` Type Change
DESCRIPTION: In Express 4.x, `res.locals` is now an object instead of a function.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_12

LANGUAGE: APIDOC
CODE:
```
res.locals: object (formerly function)
```

----------------------------------------

TITLE: Express `res.headerSent` Renamed
DESCRIPTION: The `res.headerSent` property has been renamed to `headersSent` in Express 4.x to align with Node.js `ServerResponse` object.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_13

LANGUAGE: APIDOC
CODE:
```
res.headerSent -> res.headersSent
```

----------------------------------------

TITLE: Express `req.is` Internal Implementation
DESCRIPTION: The `req.is` method in Express 4.x now internally uses the `type-is` library. Refer to `type-is` documentation for details.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_14

LANGUAGE: APIDOC
CODE:
```
req.is: uses type-is internally
```

----------------------------------------

TITLE: Registering Custom Template Engines with `app.engine()`
DESCRIPTION: Demonstrates how to use `app.engine()` to integrate a custom template engine, such as a markdown library, that does not natively expose the `__express` method. It shows how to wrap the custom rendering logic within a function compatible with Express's engine registration.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_7

LANGUAGE: js
CODE:
```
var markdown = require('some-markdown-library');

app.engine('md', function(path, options, fn){
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    str = markdown.parse(str).toString();
    fn(null, str);
  });
});
```

----------------------------------------

TITLE: Connect's Removed Global Prototype Patches
DESCRIPTION: Details global prototype patches made by Connect 2.x that were removed in Connect 3.x (and thus Express 4.0) due to being considered bad practice. These properties/methods should no longer be used.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
res.on('header')
res.charset
res.headerSent (use Node's res.headersSent instead)
special handling of res.setHeader for Set-Cookie header
```

----------------------------------------

TITLE: Express 4.x: Creating a Modular Router
DESCRIPTION: Example of defining a standalone Express Router. This snippet shows how to instantiate `express.Router()`, add middleware (`.use()`), and define route handlers (`.get()`) within a modular file, ready for export. Routers are like mini Express apps without views or settings.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/New-features-in-4.x.md#_snippet_2

LANGUAGE: javascript
CODE:
```
var people = express.Router();

people.use(function(req, res, next) {
});

people.get('/', function(req, res, next) {
});

module.exports.people = people;
```

----------------------------------------

TITLE: Integrating Socket.IO with Express.js 3.x
DESCRIPTION: Explains the necessary steps to integrate Socket.IO with Express 3.x. Since the return value of `express()` is no longer an `http.Server` instance, you must manually create an `http.Server` and pass it to Socket.IO's `.listen()` method.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_4

LANGUAGE: js
CODE:
```
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);
```

----------------------------------------

TITLE: Express `app.route(path)` Method
DESCRIPTION: Introduced in Express 4, `app.route(path)` returns a new `Route` instance. A `Route` is invoked when a request matching the specified `path` is received and can have its own middleware stacks and HTTP verb methods.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_15

LANGUAGE: APIDOC
CODE:
```
app.route(path):
  Returns: Route instance
  Description: Creates a new Route instance for a given path, supporting middleware and HTTP verb methods.
```

----------------------------------------

TITLE: Express 4 res.location() Behavior Change
DESCRIPTION: Notes that `res.location()` in Express 4.0 no longer resolves relative URLs, as browsers are expected to handle relative URL resolution themselves.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_8

LANGUAGE: APIDOC
CODE:
```
res.location(): No longer resolves relative URLs. Browsers handle relative URLs themselves.
```

----------------------------------------

TITLE: Updating middleware order after app.router removal
DESCRIPTION: Illustrates the change in middleware execution order in Express 4.0 after the removal of `app.router`. Middleware and routes now execute in the order they are added, requiring `app.use` calls that previously followed `app.router` to be moved after route definitions.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
app.use(cookieParser());
app.use(bodyParser());
/// .. other middleware .. doesn't matter what
app.use(app.router); // **this line will be removed**

// more middleware (executes after routes)
app.use(function(req, res, next) {});
// error handling middleware
app.use(function(err, req, res, next) {});

app.get('/' ...);
app.post(...);
```

LANGUAGE: JavaScript
CODE:
```
app.use(cookieParser());
app.use(bodyParser());
/// .. other middleware .. doesn't matter what

app.get('/' ...);
app.post(...);

// more middleware (executes after routes)
app.use(function(req, res, next) {});
// error handling middleware
app.use(function(err, req, res, next) {});
```

----------------------------------------

TITLE: Express `req.params` Type Change
DESCRIPTION: In Express 4.x, `req.params` is now an object instead of an array. This change does not break applications using `req.params[##]` for regular expression routes where parameter names are unknown.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_11

LANGUAGE: APIDOC
CODE:
```
req.params: object (formerly array)
```

----------------------------------------

TITLE: Removed Express.js 2.x API Features and Alternatives
DESCRIPTION: Documents API features and methods that were removed in Express.js 3.x, providing the recommended alternatives or new approaches for achieving similar functionality. This section is crucial for understanding breaking changes during migration.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
res.render() "status" option (use node's res.statusCode= or res.status(code).render(...))
res.render() "charset" option (use res.charset=)
res.local(foo, bar) (use res.locals.foo = bar or res.locals({ foo: bar }) instead)
app.dynamicHelpers() (use middleware + res.locals)
app.helpers() (use app.locals)
the concept of a "layout" (template engine specific now)
partial() (template engine specific)
res.partial()
"view options" setting, use app.locals
"hints" setting
req.isXMLHttpRequest (use req.xhr)
app.error() (use middleware with (err, req, res, next))
req.flash() (just use sessions: req.session.messages = ['foo'] or similar)
connect-flash can be used as middleware to provide req.flash()
the jsonp callback setting was removed (use res.jsonp())
```

----------------------------------------

TITLE: Express 3.x Template Engine `__express` Export Signature
DESCRIPTION: Defines the new required `exports.__express` function signature for template engines compatible with Express 3.x. This function takes the filename, options, and a callback to render the template.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_6

LANGUAGE: APIDOC
CODE:
```
exports.__express = function(filename, options, callback) {
  callback(err, string);
};
```

----------------------------------------

TITLE: Express Router Overhaul
DESCRIPTION: The Express Router has been overhauled in version 4.x, becoming a full-fledged middleware router. It facilitates separating routes into files/modules while retaining features like parameter matching and middleware.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_16

LANGUAGE: APIDOC
CODE:
```
Router: full-fledged middleware router
  Purpose: Separate routes into modules, supports parameter matching and middleware.
```

----------------------------------------

TITLE: Express 4 req.accepted() to req.accepts() Migration
DESCRIPTION: Documents the deprecation of `req.accepted()` in favor of the `req.accepts()` family of methods (`req.accepts()`, `req.acceptsEncodings()`, `req.acceptsCharsets()`, `req.acceptsLanguages()`). These methods internally use the `accepts` module and can be called without arguments to return an array.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_7

LANGUAGE: APIDOC
CODE:
```
req.accepted(): Deprecated.
Use:
  - req.accepts()
  - req.acceptsEncodings()
  - req.acceptsCharsets()
  - req.acceptsLanguages()
Note: These methods use 'accepts' internally. Call without arguments to get array-like behavior (e.g., req.acceptsLanguages() // => ['en', 'es', 'fr']).
```

----------------------------------------

TITLE: Changed Express.js 2.x API Features and Replacements
DESCRIPTION: Documents API features and methods that underwent changes or renames in Express.js 3.x. While some old names are retained for backward compatibility, the new methods are the preferred way to interact with the Express API.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
req.header(field[, defaultValue]) replaced by req.get(field) (remains for backwards compatibility)
res.header(field[, value]) replaced by res.set(field, value) / res.get(field) (remains for backwards compatibility)
renamed app.register() to app.engine()
template engine compliance from engine.compile(str, options) => Function to engine.__express(filename, options, callback)
express.createServer() is now simply express() (but remains for BC). 
  Keep in mind that the return value of express() is no longer an http.Server instance.
```

----------------------------------------

TITLE: Express 2.x Template Engine `compile` Export Signature
DESCRIPTION: Defines the required `exports.compile` function signature for template engines to be compatible with Express 2.x. This function was expected to compile a template string and return a callable function.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
exports.compile = function(templateString, options) {
  return a Function;
};
```

----------------------------------------

TITLE: Express 4 res.setHeader('Set-Cookie', val) Behavior Change
DESCRIPTION: Describes that `res.setHeader('Set-Cookie', val)` no longer implicitly appends `val` to the list of `Set-Cookie` values. Manual appending or using `res.cookie` method is required for setting cookies.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_6

LANGUAGE: APIDOC
CODE:
```
res.setHeader('Set-Cookie', val):
  - No longer implicitly appends 'val' to the current list of Set-Cookie values.
  - Manual appending or use res.cookie method is required.
```

----------------------------------------

TITLE: Express 2.x `app.error` Middleware Emulation
DESCRIPTION: This snippet demonstrates how the `app.error` method in Express 2.x was internally implemented. It shows that `app.error` was essentially a wrapper around a standard Connect error-handling middleware, which is distinguished by having exactly four arguments (`err, req, res, next`), unlike regular middleware with three or fewer arguments.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-2.x-to-3.x.md#_snippet_8

LANGUAGE: javascript
CODE:
```
app.error = function(fn){
  this.use(function(err, req, res, next){
    fn.apply(this, arguments);
  });
};
```

----------------------------------------

TITLE: Express 4 res.charset Behavior Change
DESCRIPTION: Explains that `res.charset` is no longer directly used for setting content type charset. Instead, `res.set('content-type')` or `res.type()` should be used to ensure a default charset is added. `res.setHeader()` will not implicitly add a charset.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/Migrating-from-3.x-to-4.x.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
res.charset:
  - No longer directly used for setting charset.
  - Use res.set('content-type') or res.type() to set header with charset.
  - res.setHeader() will NOT add a default charset.
```

----------------------------------------

TITLE: Configure Eson with Environment and Argument Plugins
DESCRIPTION: This JavaScript snippet demonstrates how to instantiate `eson` and apply its built-in plugins. The `.env('MYAPP_')` plugin enables reading configuration values from environment variables prefixed with 'MYAPP_', while `.args()` allows overriding settings via command-line arguments. Finally, `.read(file)` processes the configuration from the specified JSON file, applying overrides.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/ESON-JSON-Configuration.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
var conf = eson()
  .use(eson.env('MYAPP_'))
  .use(eson.args())
  .read(file);
```

----------------------------------------

TITLE: Execute Express.js Test Suite
DESCRIPTION: Command to run the automated test suite for the Express.js framework.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_10

LANGUAGE: bash
CODE:
```
npm test
```

----------------------------------------

TITLE: Express 4.x: Mounting a Modular Router
DESCRIPTION: Illustrates how to integrate a previously defined `express.Router()` instance into the main application. By using `app.use('/path', routerInstance)`, all requests to `/path/*` will be handled by the mounted router, facilitating better project organization.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/New-features-in-4.x.md#_snippet_3

LANGUAGE: javascript
CODE:
```
app.use('/people', require('./routes/people').people);
```

----------------------------------------

TITLE: Generate Express.js Application Structure
DESCRIPTION: Command to create a new Express.js application directory structure using the `express-generator`.

SOURCE: https://github.com/expressjs/express/blob/master/Readme.md#_snippet_3

LANGUAGE: bash
CODE:
```
express /tmp/foo && cd /tmp/foo
```

----------------------------------------

TITLE: Initialize Express and Eson for Environment-Based Configuration
DESCRIPTION: This JavaScript code initializes an Express application and imports the `eson` library. It then constructs a file path for configuration, dynamically selecting a JSON file based on the current Express environment (`app.get('env')`), which defaults to 'development'.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/ESON-JSON-Configuration.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
var express = require('express');
var app = express();
var eson = require('eson');
var file = __dirname + '/config/' + app.get('env') + '.json';
```

----------------------------------------

TITLE: Express 4.x: Sequential Route and Middleware Execution
DESCRIPTION: Illustrates the new routing behavior in Express 4.x where `app.use()` and `app[VERB]()` methods are processed in the exact order they are called, eliminating the need for `app.use(app.router)`.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/New-features-in-4.x.md#_snippet_0

LANGUAGE: javascript
CODE:
```
app.get('/', home);
app.use('/public', require('st')(process.cwd()));
app.get('/users', users.list);
app.post('/users', users.create);
```

----------------------------------------

TITLE: Express 4.x: Chaining HTTP Methods with app.route()
DESCRIPTION: Demonstrates the `app.route(path)` method, which returns a `Route` instance. This allows chaining multiple HTTP verb handlers (`.get()`, `.post()`) and route-specific middleware for a single path, improving code organization and readability. It also supports an `.all()` method.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/New-features-in-4.x.md#_snippet_1

LANGUAGE: javascript
CODE:
```
app.route('/users')
.get(function(req, res, next) {})
.post(function(req, res, next) {})
```

----------------------------------------

TITLE: Save Express Benchmark Results to File
DESCRIPTION: Executes the Express.js benchmarks and redirects the entire output to a specified log file, `results.log`. This allows for persistent storage and later analysis of benchmark results without cluttering the console.

SOURCE: https://github.com/expressjs/express/blob/master/benchmarks/README.md#_snippet_4

LANGUAGE: Shell
CODE:
```
make > results.log
```

----------------------------------------

TITLE: Express.js Application API
DESCRIPTION: Methods and properties available on the `app` object for configuring the Express application, handling views, and managing local variables.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/New-features-in-3.x.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
app.head() support
app.locals object (app.locals.foo = 'bar')
app.locals(obj) (app.locals({ foo: 'bar', bar: 'baz'}))
app.render(name[, options], callback) to render app-level views
app.engine(ext, callback) to map template engines
```

----------------------------------------

TITLE: Express.js Core Prototypes
DESCRIPTION: Fundamental prototypes provided by the Express.js module, forming the basis for application, request, and response objects.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/New-features-in-3.x.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
express.application prototype
express.request prototype
express.response prototype
```

----------------------------------------

TITLE: Express.js Application Settings
DESCRIPTION: Configuration settings that influence the behavior of the Express.js application, such as proxy trust for protocol detection and JSON response formatting.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/New-features-in-3.x.md#_snippet_2

LANGUAGE: APIDOC
CODE:
```
trust proxy setting enables the use of "X-Forwarded-Proto" for req.protocol and res.redirect url construction
json spaces setting enables the developer to decide if res.json() responds with nicely formatted JSON or compact json (this value is passed to JSON.stringify())
json replacer setting is a callback which is passed to JSON.stringify() in res.json() allowing you to manipulate and filter the JSON response
```

----------------------------------------

TITLE: Express.js Response Object API
DESCRIPTION: Comprehensive API for the `res` (response) object, enabling manipulation of response headers, content type, formatting, cookie management, redirection, and JSONP support.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/New-features-in-3.x.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
res.get(field): gets a response header field value (res.get('Content-Length'))
res.set(field, value): sets a response header field (res.set('Content-Length', n))
res.set(obj): set several field values
res.type(path): alias of previous res.contentType(path), allows res.type('json'), res.type('application/x-whatever')
res.format(obj): to format responses based on qvalue-sorted Accept
JSON cookie support: (res.cookie('cart', { ids: [1,2,3] }), req.cookies.cart.ids)
signed cookie support: (res.cookie(name, value, { signed: true }))
res.format(obj): for content-negotiation
res.locals object: (res.locals.foo = 'bar')
res.locals(obj): (res.locals({ foo: 'bar', bar: 'baz'}))
res.redirect(): X-Forwarded-Proto support
res.redirect(): relative support (res.redirect('../new'), res.redirect('./edit'), etc)
res.links(obj): set the "Link" header field with the given links
res.jsonp([status], obj): was added for explicit JSONP support
```

----------------------------------------

TITLE: Iterating and Displaying User Data in EJS
DESCRIPTION: This EJS snippet iterates over a 'users' array, which is expected to contain objects with 'name' and 'email' properties. For each user, it generates a list item displaying their name and email address. This is a common pattern for rendering dynamic data in web templates.

SOURCE: https://github.com/expressjs/express/blob/master/examples/ejs/views/users.html#_snippet_0

LANGUAGE: EJS
CODE:
```
<% users.forEach(function(user){ %>*   <%= user.name %> <<%= user.email %>>
<% }) %>
```

----------------------------------------

TITLE: Express.js Request Object API
DESCRIPTION: Detailed API for the `req` (request) object, providing access to incoming request properties, headers, content negotiation information, and client IP addresses.

SOURCE: https://github.com/expressjs/express/blob/master/__wiki__/New-features-in-3.x.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
req.path: the request pathname
req.protocol: returns the protocol string "http" or "https" (supports X-Forwarded-Proto via `trust proxy` setting)
req.get(field): gets a request header field value (req.get('Host'))
req.accepts(type): improved
req.accepts(types): added, returns the most viable type
req.accepted: array of parsed __Accept__ values sorted by quality
req.acceptsCharset(charset): added
req.acceptedCharsets: array of parsed __Accept-Charset__ values sorted by quality
req.acceptsLanguage(lang): added
req.acceptedLanguages: array of parsed __Accept-Language__ values sorted by quality
req.signedCookies: object containing signed cookies
req.stale: to see if a request is stale (based on ETag/Last-Modified)
req.fresh: to complement req.stale
req.ips: to return an array of X-Forwarded-For values when "trust proxy" is enabled
req.ip: return the upstream addr in req.ips or req.connection.remoteAddress
req.range(size): parses the Range header field
```

----------------------------------------

TITLE: EJS Variable Interpolation
DESCRIPTION: This snippet demonstrates how to display the value of a JavaScript variable named 'title' within an EJS template. This is a fundamental pattern in Express.js applications using EJS as the view engine to inject dynamic data into HTML or other template files.

SOURCE: https://github.com/expressjs/express/blob/master/examples/ejs/views/header.html#_snippet_0

LANGUAGE: EJS
CODE:
```
<%= title %>
```