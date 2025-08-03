========================
CODE SNIPPETS
========================
TITLE: Setup and Run jQuery Unit Tests
DESCRIPTION: Commands to install dependencies and start the development server for running jQuery unit tests. Ensures the project is ready for testing and development.

SOURCE: https://github.com/jquery/jquery/blob/main/README.md#_snippet_10

LANGUAGE: bash
CODE:
```
npm install
```

LANGUAGE: bash
CODE:
```
npm start
```

----------------------------------------

TITLE: Start Test Server
DESCRIPTION: Starts a local development server that hosts the jQuery test suite. This server allows you to run tests in a browser environment and view results.

SOURCE: https://github.com/jquery/jquery/blob/main/CONTRIBUTING.md#_snippet_6

LANGUAGE: bash
CODE:
```
npm run test:server
```

----------------------------------------

TITLE: Get Test Suite Help
DESCRIPTION: Displays detailed help information and available options for running the unit test suite from the command line. This is useful for understanding advanced configurations.

SOURCE: https://github.com/jquery/jquery/blob/main/CONTRIBUTING.md#_snippet_11

LANGUAGE: bash
CODE:
```
npm run test:unit -- --help
```

----------------------------------------

TITLE: Install npm Modules
DESCRIPTION: Installs all npm modules that jQuery's build process depends on. This is a prerequisite step before making any changes to the codebase for deprecation or other modifications.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/Helpful-Tips-for-Contribution.md#_snippet_0

LANGUAGE: shell
CODE:
```
npm install
```

----------------------------------------

TITLE: Get jQuery Build Script Help
DESCRIPTION: Command to display the full list of available options for the jQuery build script, allowing for custom builds.

SOURCE: https://github.com/jquery/jquery/blob/main/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm run build -- --help
```

----------------------------------------

TITLE: Alternative HTTP Server for Testing
DESCRIPTION: Starts a generic non-PHP static HTTP server, for example, using Python or the 'http-server' npm package. This method is suitable for most tests but will not work for AJAX tests and may cause other tests to fail.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/Helpful-Tips-for-Contribution.md#_snippet_3

LANGUAGE: shell
CODE:
```
http-server
```

----------------------------------------

TITLE: Build jQuery Project
DESCRIPTION: Commands to install dependencies and build the jQuery project. Requires Node.js and npm. The built version is placed in the dist/ directory.

SOURCE: https://github.com/jquery/jquery/blob/main/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
cd jquery
npm install
npm run build
```

----------------------------------------

TITLE: Install Project Dependencies
DESCRIPTION: Installs all necessary Node.js dependencies required for building, testing, and developing jQuery. This command uses npm (Node Package Manager).

SOURCE: https://github.com/jquery/jquery/blob/main/CONTRIBUTING.md#_snippet_4

LANGUAGE: bash
CODE:
```
npm install
```

----------------------------------------

TITLE: Combine Build Options Example
DESCRIPTION: Demonstrates how multiple build configuration options can be combined to create a custom jQuery build, such as a slim, factory, ESM module placed in a specific directory.

SOURCE: https://github.com/jquery/jquery/blob/main/README.md#_snippet_8

LANGUAGE: bash
CODE:
```
npm run build -- --filename=jquery.factory.slim.module.js --factory --esm --slim --dir="/dist-module"
```

----------------------------------------

TITLE: Install Dependencies
DESCRIPTION: Installs all necessary project dependencies using npm, which are required for building and releasing jQuery.

SOURCE: https://github.com/jquery/jquery/blob/main/build/release/README.md#_snippet_1

LANGUAGE: npm
CODE:
```
npm install
```

----------------------------------------

TITLE: ESM and CommonJS import examples
DESCRIPTION: Provides examples of how to import jQuery using both ECMAScript Modules (ESM) 'import' syntax and CommonJS 'require' syntax. This demonstrates the compatibility maintained by the 'exports' configuration.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/jQuery-4-exports-explainer.md#_snippet_4

LANGUAGE: javascript
CODE:
```
import $ from "jquery";
```

LANGUAGE: javascript
CODE:
```
const $ = require( "jquery" );
```

----------------------------------------

TITLE: Install jQuery from npm
DESCRIPTION: Command to install the jQuery package from the npm registry. This is the standard way to add jQuery to projects managed with npm or yarn.

SOURCE: https://github.com/jquery/jquery/blob/main/build/fixtures/README.md#_snippet_9

LANGUAGE: sh
CODE:
```
npm install jquery
```

----------------------------------------

TITLE: AMD Module Definition Example
DESCRIPTION: Provides an example of defining a module using the Asynchronous Module Definition (AMD) format, commonly used in browser environments. AMD helps manage dependencies and load modules asynchronously.

SOURCE: https://github.com/jquery/jquery/blob/main/build/fixtures/README.md#_snippet_13

LANGUAGE: javascript
CODE:
```
define( [ "jquery" ], function( $ ) {
  // Module code here
});
```

----------------------------------------

TITLE: Build Artifact Verification
DESCRIPTION: Confirms that the `jquery-release` process correctly generated all necessary distribution files. This includes checking for the presence and correctness of minified, mapped, and zipped versions of the library.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/Release-process.md#_snippet_4

LANGUAGE: text
CODE:
```
* Verify that files were created correctly by jquery-release
  - jquery-VER.js, jquery-VER.min.js, jquery-VER.min.map
  - jquery.js, jquery.min.js, jquery.min.map
  - mscdn-jquery-VER.zip, googlecdn-jquery-VER.zip
```

----------------------------------------

TITLE: Blog Post and GitHub Release Creation
DESCRIPTION: Details the steps for creating a draft blog post on blog.jquery.com and preparing it for publication. This includes highlighting major changes, adding contributor lists, and generating changelogs.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/Release-process.md#_snippet_2

LANGUAGE: text
CODE:
```
* Create draft blog post on blog.jquery.com; save the link, it will be needed during the `jquery-release` process
  - Highlight major changes and reason for release
  - Add contributor list generated in the below release script
  - Add changelog generated in the below release script
* Add a link to the blog post and a short description of the release to GitHub releases.
```

----------------------------------------

TITLE: jQuery to Get CSS Width
DESCRIPTION: Uses jQuery to select an element with the ID 'test' and retrieve its computed CSS 'width' property. The retrieved width value is then passed to the startIframeTest function.

SOURCE: https://github.com/jquery/jquery/blob/main/test/data/css/cssWidthBeforeDocReady.html#_snippet_1

LANGUAGE: JavaScript
CODE:
```
startIframeTest( jQuery( "#test" ).css( 'width' ) );
```

----------------------------------------

TITLE: Local PHP Server for Testing
DESCRIPTION: Starts a local PHP-based HTTP server on localhost port 8000. This is one method to serve the test files for manual browser-based unit testing, though some tests might fail.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/Helpful-Tips-for-Contribution.md#_snippet_2

LANGUAGE: shell
CODE:
```
php -S localhost:8000
```

----------------------------------------

TITLE: Pre-Release Testing and Verification
DESCRIPTION: Ensures the stability and correctness of the build by running tests across different environments and verifying build artifacts. This includes checking CI build statuses and manually testing specific browser versions.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/Release-process.md#_snippet_0

LANGUAGE: text
CODE:
```
* Verify good test results; run tests in browsers which failed some tests:
  - for `main`:
    - Node tests: https://github.com/jquery/jquery/actions/workflows/node.js.yml?query=branch%3Amain
    - BrowserStack tests: https://github.com/jquery/jquery/actions/workflows/browserstack.yml?query=branch%3Amain
  - for `3.x-stable`:
    - Node tests: https://github.com/jquery/jquery/actions/workflows/node.js.yml?query=branch%3A3.x-stable
    - BrowserStack tests: https://github.com/jquery/jquery/actions/workflows/browserstack.yml?query=branch%3A3.x-stable
* If this is a `3.x` release, run the full test suite manually on BrowserStack Live on the following browsers which no longer work properly in CI:
  - iOS 10
  - iOS 7
* Run any release-only tests, such as those in the `test/integration` folder.
* Make sure latest [GitHub CI build](https://github.com/jquery/jquery/actions) for the relevant is green; if not, restart a job or run `npm test` locally to verify.
```

----------------------------------------

TITLE: QUnit Assertion Example
DESCRIPTION: An example of using QUnit to assert a condition is true, typically used in JavaScript testing.

SOURCE: https://github.com/jquery/jquery/blob/main/test/data/test.include.html#_snippet_2

LANGUAGE: javascript
CODE:
```
QUnit.assert.ok( true, "test.include.html executed" );
```

----------------------------------------

TITLE: jQuery factory usage example
DESCRIPTION: Demonstrates the usage of the 'jquery/factory' entry point, which allows for creating a jQuery instance with a custom environment, such as a specific window object. This is useful for server-side rendering or testing scenarios.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/jQuery-4-exports-explainer.md#_snippet_6

LANGUAGE: javascript
CODE:
```
import { jQueryFactory } from "jquery/factory";
const $ = jQueryFactory( window );
```

----------------------------------------

TITLE: Dynamic jQuery Loading and Test Setup
DESCRIPTION: This snippet demonstrates how to load a different version of jQuery dynamically using jQuery.noConflict() and $.getScript(). It sets up a timeout and handles document ready events for testing purposes. Dependencies include jQuery itself.

SOURCE: https://github.com/jquery/jquery/blob/main/test/data/core/dynamic_ready.html#_snippet_0

LANGUAGE: javascript
CODE:
```
var $j = jQuery.noConflict();
var timeoutId, $, timeoutFired = false;

setTimeout(function () {
  // Load another jQuery copy using the first one.
  $j.getScript( "../../../dist/jquery.js", function () {
    $j( "#dont\_return" ).attr( "src", "about:blank" );
    // document ready handled by the just-loaded jQuery copy.
    $(function () {
      clearTimeout( timeoutId );
      if ( !timeoutFired ) {
        startIframeTest( true );
      }
    });
  });

  timeoutId = setTimeout(function () {
    timeoutFired = true;
    startIframeTest( false );
  }, 10000);
});
```

----------------------------------------

TITLE: Prepare Tests for Command Line
DESCRIPTION: Executes pre-testing tasks, such as setting up the test environment or generating necessary files, before running the test suite from the command line.

SOURCE: https://github.com/jquery/jquery/blob/main/CONTRIBUTING.md#_snippet_9

LANGUAGE: bash
CODE:
```
npm run pretest
```

----------------------------------------

TITLE: Post-Release Communication and Updates
DESCRIPTION: Details the final steps after a successful release, including publishing the blog post, updating GitHub releases, and announcing the new version on social media platforms like Mastodon and Twitter.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/Release-process.md#_snippet_5

LANGUAGE: text
CODE:
```
* Publish post on http://blog.jquery.com
* Post the release on Mastodon and Twitter.
```

----------------------------------------

TITLE: QUnit Assertion Example
DESCRIPTION: This snippet shows how to use the QUnit.assert.ok function to assert that a condition is true. It's commonly used in JavaScript unit tests to verify expected outcomes. The function takes a boolean value and an optional message string.

SOURCE: https://github.com/jquery/jquery/blob/main/test/data/name.html#_snippet_0

LANGUAGE: javascript
CODE:
```
QUnit.assert.ok( true, "name.html retrieved" );
```

----------------------------------------

TITLE: jQuery Release Script Execution
DESCRIPTION: Provides instructions for executing the `jquery-release` script for a new version. It emphasizes using a clean copy and performing a dry run on a separate fork before the actual release.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/Release-process.md#_snippet_3

LANGUAGE: text
CODE:
```
* Do release using instructions at [jquery-release project README](https://github.com/jquery/jquery-release#readme)
  - Be sure to clone a CLEAN copy, don't reuse
  - Target something other than jquery/jquery (like your own fork) for a dry run
```

----------------------------------------

TITLE: Submit Form After DOM Ready
DESCRIPTION: This example shows how to execute a function immediately after the DOM is fully loaded and ready. It uses setTimeout with a delay of 0 to ensure the form submission happens asynchronously after the current script execution context is cleared.

SOURCE: https://github.com/jquery/jquery/blob/main/test/data/ajax/onunload.html#_snippet_1

LANGUAGE: javascript
CODE:
```
jQuery(function() {
  setTimeout(function() {
    document.getElementById( "navigate" ).submit();
  }, 0 );
});
```

----------------------------------------

TITLE: Build All jQuery Release Variants
DESCRIPTION: Command to build all variants of jQuery, including slim, module, and minified versions with sourcemaps. ECMAScript modules are placed in dist-module/.

SOURCE: https://github.com/jquery/jquery/blob/main/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm run build:all
```

----------------------------------------

TITLE: QUnit Test Suite Convenience Methods
DESCRIPTION: Helper methods provided by the jQuery test suite for selecting elements, asserting selections, firing native DOM events, and managing URL caching.

SOURCE: https://github.com/jquery/jquery/blob/main/README.md#_snippet_13

LANGUAGE: APIDOC
CODE:
```
QUnit Test Suite Helpers:
  q( ... )
    - Returns an array of DOM elements with the given IDs.
    - Example: q( "main", "foo", "bar" ) => [ div#main, span#foo, input#bar ]

  t( testName, selector, [ "array", "of", "ids" ] )
    - Asserts that a selection matches the given IDs.
    - Example: t("Check for something", "//[a]", ["foo", "bar"])

  fireNative( node, eventType )
    - Fires a native DOM event on a given node without using jQuery.
    - Example: fireNative( jQuery( "#elem" )[ 0 ], "click" )

  url( path )
    - Adds a random number to a URL to prevent caching.
    - Example: url( "some/url" ) => "data/some/url?10538358428943"
    - Example: url( "mock.php?foo=bar" ) => "data/mock.php?foo=bar&10538358345554"
```

----------------------------------------

TITLE: Basic CSS Styling
DESCRIPTION: Applies basic width and height styles to the HTML body element. This CSS rule sets the dimensions for the main content area.

SOURCE: https://github.com/jquery/jquery/blob/main/test/data/dimensions/documentLarge.html#_snippet_0

LANGUAGE: css
CODE:
```
body {
  width: 1000px;
  height: 1000px;
}
```

----------------------------------------

TITLE: Configure Factory Entry Point (./factory)
DESCRIPTION: This JSON configuration defines the entry point for the jQuery factory, simplifying the setup by directly serving CommonJS and ESM versions without wrappers, leveraging named exports.

SOURCE: https://github.com/jquery/jquery/blob/main/__wiki__/jQuery-4-exports-explainer.md#_snippet_13

LANGUAGE: json
CODE:
```
"./factory": {
  "node": "./dist/jquery.factory.js",
  "module": "./dist-module/jquery.factory.module.js",
  "import": "./dist-module/jquery.factory.module.js",
  "default": "./dist/jquery.factory.js"
}
```

----------------------------------------

TITLE: CSS Positioning Classes
DESCRIPTION: Defines CSS classes for common positioning values: static, relative, absolute, and fixed. These are fundamental for layout control in web design.

SOURCE: https://github.com/jquery/jquery/blob/main/test/data/offset/boxes.html#_snippet_0

LANGUAGE: css
CODE:
```
.static { position: static; }
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
```

----------------------------------------

TITLE: Initialize main page with bootstrapFrom
DESCRIPTION: Calls the `bootstrapFrom` function, likely initializing a UI component or framework on the main page. This function is typically used to set up the application's initial state or render content.

SOURCE: https://github.com/jquery/jquery/blob/main/test/integration/gh-1764-fullscreen.html#_snippet_1

LANGUAGE: JavaScript
CODE:
```
bootstrapFrom( ".main-page" );
```

----------------------------------------

TITLE: Change Test Server Port
DESCRIPTION: Starts the test server on a different port (e.g., 8000) instead of the default port 3000. This is useful if port 3000 is already in use.

SOURCE: https://github.com/jquery/jquery/blob/main/CONTRIBUTING.md#_snippet_7

LANGUAGE: bash
CODE:
```
npm run test:server -- --port 8000
```