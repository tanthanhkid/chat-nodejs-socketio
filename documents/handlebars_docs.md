========================
CODE SNIPPETS
========================
TITLE: Running Development Server - Handlebars.js - Shell
DESCRIPTION: Starts a development server using Grunt, enabling watching for file changes and in-browser testing at `http://localhost:9999/spec/`.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_6

LANGUAGE: sh
CODE:
```
grunt dev
```

----------------------------------------

TITLE: Installing Project Dependencies - Handlebars.js - Shell
DESCRIPTION: Installs the necessary Node.js packages required to build and test Handlebars.js. This command should be run from the project's root directory after cloning.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_0

LANGUAGE: sh
CODE:
```
npm install
```

----------------------------------------

TITLE: Running Integration Tests - Handlebars.js - Shell
DESCRIPTION: Executes integration tests that check compatibility with older Node.js versions and integrations like webpack and babel. Requires a Linux machine with `nvm` installed.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_11

LANGUAGE: sh
CODE:
```
npm run test:integration
```

----------------------------------------

TITLE: Handlebars Compiled Template Main Function - JavaScript
DESCRIPTION: This function is the main entry point for the compiled Handlebars template. It takes standard Handlebars context arguments and returns the rendered HTML string.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/spec/expected/compiled.string.txt#_snippet_0

LANGUAGE: JavaScript
CODE:
```
function(container,depth0,helpers,partials,data) {
    return "<div>Test String</div>";
}
```

----------------------------------------

TITLE: Publish Handlebars Packages
DESCRIPTION: This sequence of commands performs a full release of the Handlebars library. It installs dependencies, runs build tasks, publishes the package to npm, navigates to the components directory, builds the RubyGems package, and pushes it to RubyGems.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_12

LANGUAGE: Shell
CODE:
```
npm ci
npx grunt
npm publish

cd dist/components/
gem build handlebars-source.gemspec
gem push handlebars-source-*.gem
```

----------------------------------------

TITLE: Using Handlebars.Visitor for AST Traversal (JavaScript)
DESCRIPTION: Demonstrates how to extend the base Handlebars.Visitor class to traverse the AST and collect information. This example creates an ImportScanner to record referenced partial names by overriding the PartialStatement method.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/docs/compiler-api.md#_snippet_6

LANGUAGE: javascript
CODE:
```
var Visitor = Handlebars.Visitor;

function ImportScanner() {
  this.partials = [];
}
ImportScanner.prototype = new Visitor();

ImportScanner.prototype.PartialStatement = function (partial) {
  this.partials.push({ request: partial.name.original });

  Visitor.prototype.PartialStatement.call(this, partial);
};

var scanner = new ImportScanner();
scanner.accept(ast);
```

----------------------------------------

TITLE: Checking Handlebars Compiler Version (Shell)
DESCRIPTION: Provides a shell command to check the version of the Handlebars precompiler installed globally or in the current environment. Useful for verifying that the compiler version matches the runtime version used on the client side.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/FAQ.md#_snippet_1

LANGUAGE: sh
CODE:
```
handlebars --version
```

----------------------------------------

TITLE: Customize Handlebars Lookup with Custom Compiler and Helper - JavaScript
DESCRIPTION: This code defines a custom Handlebars JavaScript compiler (`MyCompiler`) that overrides the `nameLookup` method. It directs 'context' type lookups to a custom helper `lookupLowerCase`. The `lookupLowerCase` helper performs a case-insensitive lookup on the parent object. The example then registers this custom compiler and helper with a new Handlebars environment, compiles a template using the custom compiler, and executes it to demonstrate the case-insensitive lookup.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/docs/compiler-api.md#_snippet_7

LANGUAGE: javascript
CODE:
```
function MyCompiler() {
  Handlebars.JavaScriptCompiler.apply(this, arguments);
}
MyCompiler.prototype = new Handlebars.JavaScriptCompiler();

// Use this compile to compile BlockStatment-Blocks
MyCompiler.prototype.compiler = MyCompiler;

MyCompiler.prototype.nameLookup = function (parent, name, type) {
  if (type === 'context') {
    return this.source.functionCall('helpers.lookupLowerCase', '', [
      parent,
      JSON.stringify(name),
    ]);
  } else {
    return Handlebars.JavaScriptCompiler.prototype.nameLookup.call(
      this,
      parent,
      name,
      type
    );
  }
};

var env = Handlebars.create();
env.registerHelper('lookupLowerCase', function (parent, name) {
  return parent[name.toLowerCase()];
});

env.JavaScriptCompiler = MyCompiler;

var template = env.compile('{{#each Test}} ({{Value}}) {{/each}}');
console.log(
  template({
    test: [{ value: 'a' }, { value: 'b' }, { value: 'c' }],
  })
);
```

----------------------------------------

TITLE: Defining Enumerable __proto__ Property in JavaScript Object
DESCRIPTION: This JavaScript object literal demonstrates defining `__proto__` as an enumerable property. This specific case is highlighted in the v4.5.3 changelog as an example where the security fix preventing access to non-enumerable prototype properties does *not* change the behavior.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/release-notes.md#_snippet_0

LANGUAGE: javascript
CODE:
```
{
  __proto__: 'some string';
}
```

----------------------------------------

TITLE: Running Benchmarks - Handlebars.js - Shell
DESCRIPTION: Executes the project's benchmark suite using Grunt to measure performance.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_5

LANGUAGE: sh
CODE:
```
grunt bench
```

----------------------------------------

TITLE: Run Browser Tests with Playwright using Docker - Bash
DESCRIPTION: These commands set up the project dependencies, prepare the test environment, pull the necessary Playwright Docker image, and execute the browser tests within a Docker container.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/tests/browser/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm install
npx grunt prepare
docker pull mcr.microsoft.com/playwright:focal
docker run -it --rm --volume $(pwd):/srv/app --workdir /srv/app --ipc=host mcr.microsoft.com/playwright:focal npm run test:browser
```

----------------------------------------

TITLE: Initializing Git Submodules - Handlebars.js - Shell
DESCRIPTION: Ensures that the Git submodule for the Mustache specs (`spec/mustache`) is included. This is necessary if the repository was not cloned recursively initially.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_1

LANGUAGE: sh
CODE:
```
git submodule update --init
```

----------------------------------------

TITLE: Building Handlebars.js - Grunt - Shell
DESCRIPTION: Runs the default Grunt task to build Handlebars.js from source. The output files are placed in the `dist/` directory.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_2

LANGUAGE: sh
CODE:
```
grunt
```

----------------------------------------

TITLE: Running Tests (Grunt) - Handlebars.js - Shell
DESCRIPTION: Executes the test suite using Grunt. This command runs the tests defined in the Grunt configuration.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_3

LANGUAGE: sh
CODE:
```
grunt test
```

----------------------------------------

TITLE: Running Tests (npm) - Handlebars.js - Shell
DESCRIPTION: Executes the test suite using the npm test script. This is an alternative way to run the tests, typically configured in `package.json`.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_4

LANGUAGE: sh
CODE:
```
npm test
```

----------------------------------------

TITLE: Running ESLint - Handlebars.js - Shell
DESCRIPTION: Executes the ESLint linter to check for code style and potential issues. This command will fail on warnings according to the CI configuration.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_8

LANGUAGE: sh
CODE:
```
npm run lint
```

----------------------------------------

TITLE: Running Prettier - Handlebars.js - Shell
DESCRIPTION: Runs the Prettier formatter on all relevant files to automatically fix code style issues.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_9

LANGUAGE: sh
CODE:
```
npm run format
```

----------------------------------------

TITLE: Running Pre-Pull Request Checks - Handlebars.js - Shell
DESCRIPTION: Executes most checks performed by the CI build job, excluding integration tests. This helps contributors verify their changes before submitting a pull request.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_10

LANGUAGE: sh
CODE:
```
npm run check-before-pull-request
```

----------------------------------------

TITLE: Running Tests with Mocha
DESCRIPTION: This command executes the test suite using the Mocha test framework. It targets the tests located within the `tasks/tests` directory.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/tasks/tests/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
mocha tasks/tests
```

----------------------------------------

TITLE: Cloning Mustache Specs - Handlebars.js - Shell
DESCRIPTION: Removes the existing `spec/mustache` directory and clones the latest Mustache specs repository into it. This ensures tests run against the current spec version.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/CONTRIBUTING.md#_snippet_7

LANGUAGE: sh
CODE:
```
cd spec
rm -r mustache
git clone https://github.com/mustache/spec.git mustache
```

----------------------------------------

TITLE: Compiling and Rendering a Handlebars Template in JavaScript
DESCRIPTION: This snippet demonstrates the basic usage of Handlebars.js. It defines a template string, compiles it into a function using `Handlebars.compile`, and then renders the template by calling the compiled function with a data object. The result is an HTML string generated from the template and data.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/README.markdown#_snippet_0

LANGUAGE: JavaScript
CODE:
```
var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
             "{{kids.length}} kids:</p>" +
             "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
var template = Handlebars.compile(source);

var data = { "name": "Alan", "hometown": "Somewhere, TX",
             "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
var result = template(data);

// Would render:
// <p>Hello, my name is Alan. I am from Somewhere, TX. I have 2 kids:</p>
// <ul>
//   <li>Jimmy is 12</li>
//   <li>Sally is 4</li>
// </ul>
```

----------------------------------------

TITLE: Checking Handlebars Runtime Version (JavaScript)
DESCRIPTION: Shows how to access and log the version of the Handlebars runtime library loaded in the browser or client-side JavaScript environment. Used to ensure the runtime version matches the precompiler version when troubleshooting exceptions.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/FAQ.md#_snippet_2

LANGUAGE: javascript
CODE:
```
console.log(Handlebars.VERSION);
```

----------------------------------------

TITLE: Parse, Modify, and Precompile Handlebars AST (JavaScript)
DESCRIPTION: Demonstrates the basic workflow of using the Handlebars AST: parsing a template string into an AST object, allowing for modification of the AST structure, and then precompiling the modified AST back into a template function. This snippet illustrates the core interaction pattern with the AST for advanced tooling.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/docs/compiler-api.md#_snippet_0

LANGUAGE: javascript
CODE:
```
var ast = Handlebars.parse(myTemplate);

// Modify ast

Handlebars.precompile(ast);
```

----------------------------------------

TITLE: Defining Miscellaneous AST Node Structures (Java)
DESCRIPTION: Defines the structure for miscellaneous nodes and types in the Handlebars AST, including Hash (for key-value pairs), HashPair (for individual pairs), and StripFlags (used to signify whitespace control characters).

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/docs/compiler-api.md#_snippet_5

LANGUAGE: java
CODE:
```
interface Hash <: Node {
    type: "Hash";
    pairs: [ HashPair ];
}

interface HashPair <: Node {
    type: "HashPair";
    key: string;
    value: Expression;
}

interface StripFlags {
    open: boolean;
    close: boolean;
}
```

----------------------------------------

TITLE: Defining PathExpression AST Node Structure (Java)
DESCRIPTION: Defines the structure of a PathExpression node in the Handlebars AST. It includes properties for data references, context depth, path components, and the original user-entered path string.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/docs/compiler-api.md#_snippet_3

LANGUAGE: java
CODE:
```
interface PathExpression <: Expression {
    type: "PathExpression";
    data: boolean;
    depth: uint >= 0;
    parts: [ string ];
    original: string;
}
```

----------------------------------------

TITLE: Including Script Tags in Handlebars HTML Template
DESCRIPTION: Demonstrates how to include a script tag within an inline Handlebars template tag (<script type="text/x-handlebars">) by breaking up the tag name with an empty comment ({{!}}) to avoid browser parsing errors. Recommends using external, precompiled files instead.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/FAQ.md#_snippet_0

LANGUAGE: html
CODE:
```
<script type="text/x-handlebars">
  foo
  <scr{{!}}ipt src="bar"></scr{{!}}ipt>
</script>
```

----------------------------------------

TITLE: Parse Handlebars Template with Whitespace Processing (JavaScript)
DESCRIPTION: Employs the `Handlebars.parse` method to convert a Handlebars template string into an AST, including automatic whitespace stripping. This method first parses the template and then modifies the AST to remove standalone whitespace and apply whitespace control characters (`~`), mirroring the behavior used internally by `Handlebars.precompile` and `Handlebars.compile`.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/docs/compiler-api.md#_snippet_2

LANGUAGE: js
CODE:
```
let ast = Handlebars.parse(myTemplate);
```

----------------------------------------

TITLE: Parse Handlebars Template Without Processing (JavaScript)
DESCRIPTION: Uses the `Handlebars.parseWithoutProcessing` method to convert a raw Handlebars template string into its Abstract Syntax Tree (AST) representation. This method performs no additional processing like whitespace stripping, making it suitable for tools that need the raw parsed structure, such as codemods for source-to-source transformations.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/docs/compiler-api.md#_snippet_1

LANGUAGE: js
CODE:
```
let ast = Handlebars.parseWithoutProcessing(myTemplate);
```

----------------------------------------

TITLE: Demonstrating Prohibited Constructor Access in Handlebars Templates (JavaScript)
DESCRIPTION: This JavaScript code snippet demonstrates a pattern that is now prohibited in Handlebars versions 4.1.0 and later to prevent Remote Code Execution (RCE). It shows how attempting to access a static property of a class via the constructor lookup within a Handlebars template will no longer work, resulting in an empty output instead of the expected value.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/release-notes.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
class SomeClass {
}

SomeClass.staticProperty = 'static'

var template = Handlebars.compile('{{constructor.staticProperty}}');
document.getElementById('output').innerHTML = template(new SomeClass());
// expected: 'static', but now this is empty.
```

----------------------------------------

TITLE: Updating Template Signature Handlebars JavaScript
DESCRIPTION: When upgrading from Handlebars 0.9 series, the method for passing custom helpers, partials, and data to a compiled template function has changed. Instead of separate arguments, they are now passed within a single options object.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/release-notes.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
template(context, helpers, partials, [data]);
```

LANGUAGE: JavaScript
CODE:
```
template(context, { helpers: helpers, partials: partials, data: data });
```

----------------------------------------

TITLE: Defining Literal AST Node Structures (Java)
DESCRIPTION: Defines the base Literal interface and specific structures for various literal types in the Handlebars AST, including String, Boolean, Number, Undefined, and Null literals, capturing their value and original representation where applicable.

SOURCE: https://github.com/handlebars-lang/handlebars.js/blob/master/docs/compiler-api.md#_snippet_4

LANGUAGE: java
CODE:
```
interface Literal <: Expression { }

interface StringLiteral <: Literal {
    type: "StringLiteral";
    value: string;
    original: string;
}

interface BooleanLiteral <: Literal {
    type: "BooleanLiteral";
    value: boolean;
    original: boolean;
}

interface NumberLiteral <: Literal {
    type: "NumberLiteral";
    value: number;
    original: number;
}

interface UndefinedLiteral <: Literal {
    type: "UndefinedLiteral";
}

interface NullLiteral <: Literal {
    type: "NullLiteral";
}
```