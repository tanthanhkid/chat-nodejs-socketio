========================
CODE SNIPPETS
========================
TITLE: Setup Server: Navigate, Install, and Start (Shell)
DESCRIPTION: These commands first change the current directory to 'server', install the required Node.js packages for the server using npm, and then start the server process. It assumes the server code is located in a subdirectory named 'server' and requires Node.js and npm.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/private-messaging/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
cd server
npm install
npm start
```

----------------------------------------

TITLE: Setup Frontend: Install Dependencies and Run (Shell)
DESCRIPTION: These commands install the necessary Node.js packages for the frontend application using npm and then start the development server. It requires Node.js and npm to be installed on the system.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/private-messaging/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm install
npm run serve
```

----------------------------------------

TITLE: Setting up and Running the Example Shell
DESCRIPTION: This shell script provides the necessary commands to navigate to the example directory, install project dependencies using npm, and start the Node.js server to run the Socket.IO application.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/connection-state-recovery-example/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
# choose your module syntax (either ES modules or CommonJS)
$ cd esm/

# install the dependencies
$ npm i

# start the server
$ node index.js
```

----------------------------------------

TITLE: Setting up Socket.IO WebTransport Server Shell
DESCRIPTION: Provides the necessary shell commands to get the Socket.IO WebTransport example running. This includes generating a self-signed certificate for secure connections, installing required Node.js packages using npm, starting the main server process via Node.js, and finally launching the client application in a compatible browser (like Chrome). Ensure "./generate_cert.sh" and "./open_chrome.sh" scripts exist and are executable.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/webtransport/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
# generate a self-signed certificate
$ ./generate_cert.sh

# install dependencies
$ npm i

# start the server
$ node index.js

# open a Chrome browser
$ ./open_chrome.sh
```

----------------------------------------

TITLE: Starting Socket.IO Server (Bash)
DESCRIPTION: This sequence of commands navigates into the 'server' directory, installs its dependencies using npm, and then starts the Socket.IO server. This server is necessary for the React Native app to communicate via websockets.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/ReactNativeExample/README.md#_snippet_3

LANGUAGE: bash
CODE:
```
cd server

npm install

npm start
```

----------------------------------------

TITLE: Running the Express/Socket.IO Example (Shell)
DESCRIPTION: These commands are used to set up and start the example application. The first command installs necessary Node.js dependencies listed in the package.json file. The second command starts the server, typically listening on port 3000.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/express-session-example/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ npm install
$ npm start
```

----------------------------------------

TITLE: Running Socket.IO Postgres Example Commands bash
DESCRIPTION: Lists the necessary bash commands to get the Socket.IO example with the Postgres adapter up and running. It includes commands to start the database server via Docker Compose, run the Node.js server cluster, and start a client application, with comments indicating the purpose of each step. Note that the '$ ' prefix commonly shown in documentation is omitted from the actual command lines.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/postgres-adapter-example/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
docker compose up -d

# run the cluster
node cluster.js

# run the client
node client.js
```

----------------------------------------

TITLE: Running the Example Project (Shell)
DESCRIPTION: Provides the shell command required to set up and start the example application. It first installs project dependencies using `npm ci` and then starts the server with `npm start`.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/passport-example/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ npm ci && npm start
```

----------------------------------------

TITLE: Starting Socket.IO Passport Example (Shell)
DESCRIPTION: Command to install project dependencies and start the Node.js application locally. This command should be executed in the project's root directory.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/passport-jwt-example/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm ci && npm start
```

----------------------------------------

TITLE: Running Server App - Bash
DESCRIPTION: These bash commands guide the user to navigate into the 'server' directory, install its specific Node.js dependencies using npm, and finally execute the server startup script defined in the server's `package.json` file via `npm start`.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nwjs-example/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
cd server
npm i
npm start
```

----------------------------------------

TITLE: Starting Socket.IO Chat Demo (Shell)
DESCRIPTION: These shell commands are used to set up and launch the chat demo. `npm i` installs required Node.js dependencies from the package.json file, and `npm start` executes the predefined start script to launch the server application.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/chat/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
$ npm i
$ npm start
```

----------------------------------------

TITLE: Installing Dependencies and Starting Application (Shell)
DESCRIPTION: This snippet shows the command to install project dependencies and then start the application. It uses `npm i` for installation and `npm start` to run the defined start script in the package.json. This is typically used to set up and run a demo or test environment for the Socket.IO custom parsers.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/custom-parsers/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ npm i && npm start
```

----------------------------------------

TITLE: Running Socket.IO Whiteboard Project (Shell)
DESCRIPTION: This shell command installs the necessary project dependencies using npm's 'clean install' and then starts the application server. Users can access the whiteboard in their browser after running this command.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/whiteboard/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm ci && npm start
```

----------------------------------------

TITLE: Running Client App - Bash
DESCRIPTION: This snippet provides the bash commands to install the necessary Node.js dependencies for the client-side application and then launch the application using the `nw` command-line tool, which starts the NW.js runtime in the current directory.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nwjs-example/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm i
nw .
```

----------------------------------------

TITLE: Setting up and Running Socket.IO Project - Shell
DESCRIPTION: This snippet provides the command-line instructions to prepare and run the project. `npm link ../..` links a local version of the parent directory's package (likely the `socket.io` core) into the current directory's node_modules, allowing you to test local changes. `node index.js` then executes the main script file, starting the application or example.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io/examples/esm-import/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ npm link ../..
$ node index.js
```

----------------------------------------

TITLE: Starting Socket.IO Client (Bash)
DESCRIPTION: This command executes the client script `client.js`. This script is designed to connect to the Socket.IO server cluster started by the previous command, demonstrating how a client interacts with the clustered server setup.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/cluster-engine-node-cluster/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
$ node client.js
```

----------------------------------------

TITLE: Starting Socket.IO Cluster Example (Bash)
DESCRIPTION: These bash commands provide the necessary steps to set up and run the Socket.IO cluster example. They first start the required Redis server using Docker Compose in detached mode, then execute the server and client Node.js scripts.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/cluster-engine-redis/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
# start the redis server
$ docker compose up -d

# run the cluster
$ node server.js

# run the client
$ node client.js
```

----------------------------------------

TITLE: Starting Metro Bundler (React Native, Bash)
DESCRIPTION: These commands start the Metro bundler, which is required to bundle JavaScript code for your React Native application. You should run this command from the root of your project in a dedicated terminal window.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/ReactNativeExample/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
# using npm
npm start
```

LANGUAGE: bash
CODE:
```
# OR using Yarn
yarn start
```

----------------------------------------

TITLE: Building and Running Socket.IO Webpack Server (Shell)
DESCRIPTION: These commands guide the user through setting up and running the Socket.IO server project. They involve installing project dependencies, executing the Webpack build process defined in the package.json, and finally starting the server application.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/webpack-build-server/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
$ npm i
$ npm run build
$ npm start
```

----------------------------------------

TITLE: Installing Nuxt 3 Project Dependencies (Bash)
DESCRIPTION: These commands install the necessary project dependencies defined in the package.json file for a Nuxt 3 application using various Node.js package managers. Execute the command corresponding to the package manager used in your project to ensure all required packages are installed.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nuxt-example/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm install
```

LANGUAGE: bash
CODE:
```
pnpm install
```

LANGUAGE: bash
CODE:
```
yarn install
```

LANGUAGE: bash
CODE:
```
bun install
```

----------------------------------------

TITLE: Starting Nuxt 3 Development Server (Bash)
DESCRIPTION: These commands initiate the local development server for the Nuxt 3 application, typically running at http://localhost:3000. The development server provides features like hot module replacement, making it suitable for interactive development. Use the command that matches your project's package manager.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nuxt-example/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm run dev
```

LANGUAGE: bash
CODE:
```
pnpm run dev
```

LANGUAGE: bash
CODE:
```
yarn dev
```

LANGUAGE: bash
CODE:
```
bun run dev
```

----------------------------------------

TITLE: Running the Default Socket.IO Server (shell)
DESCRIPTION: Provides shell commands to navigate to the default server directory (typically the in-memory version), install project dependencies using npm, and start the backend Socket.IO server application. This server will handle client connections and data operations.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/README.md#_snippet_1

LANGUAGE: shell
CODE:
```
cd server
npm install
npm start
```

----------------------------------------

TITLE: Running the Angular Socket.IO Frontend (shell)
DESCRIPTION: Provides shell commands to navigate to the Angular client directory, install project dependencies using npm, and start the development server for the frontend application. This allows you to access and interact with the Socket.IO client interface.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
cd angular-client
npm install
npm start
```

----------------------------------------

TITLE: Installing Vue.js Client Project Dependencies - Bash
DESCRIPTION: This command installs all required project dependencies listed in the package.json file using the yarn package manager. It must be run after cloning the repository to prepare the project for development or building.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/vue-client/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
yarn install
```

----------------------------------------

TITLE: Starting Vue.js Client Development Server - Bash
DESCRIPTION: This command starts a local development server with hot-reloading enabled. It is used during development to run and test the application in a browser.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/vue-client/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
yarn serve
```

----------------------------------------

TITLE: Starting Next.js Development Server (Bash)
DESCRIPTION: This snippet provides commands to launch the local development server for the Next.js application. It includes options for users preferring different Node.js package managers such as npm, yarn, pnpm, or bun. The server typically becomes accessible at http://localhost:3000.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nextjs-app-router/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
```

LANGUAGE: bash
CODE:
```
yarn dev
```

LANGUAGE: bash
CODE:
```
pnpm dev
```

LANGUAGE: bash
CODE:
```
bun dev
```

----------------------------------------

TITLE: Starting Socket.IO Server (npm)
DESCRIPTION: Execute this npm script to start the backend server that handles Socket.IO communication for the application. This is required for the app's real-time features.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/angular-todomvc/README.md#_snippet_1

LANGUAGE: shell
CODE:
```
npm run start:server
```

----------------------------------------

TITLE: Setting Up Development Environment - Bash
DESCRIPTION: Sequence of commands to navigate into the cloned repository directory and install dependencies using `npm ci` (clean install), ensuring the development environment is ready.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-parser/Readme.md#_snippet_8

LANGUAGE: Bash
CODE:
```
cd engine.io-parser
npm ci
```

----------------------------------------

TITLE: Getting Angular CLI Help
DESCRIPTION: Display help information and available commands for the Angular CLI. Useful for understanding command options and usage.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/angular-todomvc/README.md#_snippet_8

LANGUAGE: shell
CODE:
```
ng help
```

----------------------------------------

TITLE: Starting Socket.IO TODO Project - Shell
DESCRIPTION: Executes the necessary shell commands to launch the Socket.IO TODO application. This involves starting required services via Docker Compose, installing project dependencies using npm, and finally initiating the application process.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/server-postgres-cluster/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ docker-compose up -d
$ npm install
$ npm start
```

----------------------------------------

TITLE: Installing Socket.IO (Bash)
DESCRIPTION: These commands demonstrate how to install the Socket.IO library using the npm or yarn package managers. Installation is required to use Socket.IO in a Node.js project.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io/Readme.md#_snippet_1

LANGUAGE: bash
CODE:
```
// with npm
npm install socket.io

// with yarn
yarn add socket.io
```

----------------------------------------

TITLE: Installing NestJS Project Dependencies using npm
DESCRIPTION: This command installs all necessary dependencies for the NestJS starter project using the npm package manager. It reads the `package.json` file and downloads modules listed under `dependencies` and `devDependencies`.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nestjs-example/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
$ npm install
```

----------------------------------------

TITLE: Attaching Engine.IO Server with Options Node.js
DESCRIPTION: This example shows how to attach an Engine.IO server to an existing `http.Server` instance using the `engine.attach` method with an options object. It demonstrates specifying a different WebSocket engine, like 'eiows', which requires installing it as a dependency. Requires 'engine.io', 'http', and the specified `wsEngine` dependency.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io/README.md#_snippet_6

LANGUAGE: JavaScript
CODE:
```
const engine = require('engine.io');
const httpServer = require('http').createServer().listen(3000);
const server = engine.attach(httpServer, {
  wsEngine: require('eiows').Server // requires having eiows as dependency
});

server.on('connection', /* ... */);
```

----------------------------------------

TITLE: Starting Development Server (bash)
DESCRIPTION: This snippet provides commands to launch the local development server for the Next.js project. It shows equivalent commands using different JavaScript package managers: npm, yarn, pnpm, and bun. Running one of these commands starts the server, typically accessible at http://localhost:3000.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nextjs-pages-router/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

----------------------------------------

TITLE: Running React Native App on Android (Bash)
DESCRIPTION: These commands build and run the React Native application on a connected Android device or emulator. Ensure the Metro bundler is already running in a separate terminal and you have an Android environment set up.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/ReactNativeExample/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
# using npm
npm run android
```

LANGUAGE: bash
CODE:
```
# OR using Yarn
yarn android
```

----------------------------------------

TITLE: Installing Socket.IO Dependencies using npm ci (Bash)
DESCRIPTION: Installs project dependencies for the Socket.IO monorepo using `npm ci`. This command is recommended for contributors as it ensures a clean and consistent installation based on the `package-lock.json` file. Requires Node.js version 18+ and npm version 7+.

SOURCE: https://github.com/socketio/socket.io/blob/main/CONTRIBUTING.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm ci
```

----------------------------------------

TITLE: Starting Docker Compose Stack - Shell
DESCRIPTION: This command starts all services defined in the `docker-compose.yml` file in detached mode (`-d`). It is used to launch the Socket.IO chat application, including the HAProxy load balancer, Redis backend, and multiple Socket.IO nodes. Requires Docker Compose installation.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/cluster-haproxy/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ docker-compose up -d
```

----------------------------------------

TITLE: Starting Angular Development Server (CLI)
DESCRIPTION: Run this command to launch a local development server for the Angular application. It serves the app at http://localhost:4200/ and automatically reloads upon file changes.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
ng serve
```

----------------------------------------

TITLE: Running React Native App on iOS (Bash)
DESCRIPTION: These commands build and run the React Native application on a connected iOS device or simulator. Ensure the Metro bundler is already running and you have an iOS development environment set up (requires macOS).

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/ReactNativeExample/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
# using npm
npm run ios
```

LANGUAGE: bash
CODE:
```
# OR using Yarn
yarn ios
```

----------------------------------------

TITLE: Starting Socket.IO Chat with Docker Compose
DESCRIPTION: This command uses Docker Compose to build and start all services defined in the docker-compose.yml file in detached mode. This launches the Socket.IO nodes, the httpd proxy, and the redis instance. Prerequisite: Docker Compose installed and docker-compose.yml file present.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/cluster-httpd/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
$ docker-compose up -d
```

----------------------------------------

TITLE: Building Vue.js Client for Production - Bash
DESCRIPTION: This command compiles and minifies the Vue.js client application code for production deployment. It generates optimized static assets ready to be served.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/vue-client/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
yarn build
```

----------------------------------------

TITLE: Starting Socket.IO Chat Demo with Docker Compose (Shell)
DESCRIPTION: This command starts the Socket.IO chat demo using Docker Compose. It builds, creates, and starts all services defined in the docker-compose.yml file in detached mode.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/cluster-traefik/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
$ docker-compose up -d
```

----------------------------------------

TITLE: Install Project Dependencies npm
DESCRIPTION: This command installs all the necessary project dependencies listed in the package.json file using npm. This prepares the project environment for development, testing, or building the library. It requires Node.js and npm (or a compatible package manager) to be installed.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-client/README.md#_snippet_10

LANGUAGE: bash
CODE:
```
npm install

```

----------------------------------------

TITLE: Integrating Socket.IO with Node.js HTTP Server (JavaScript)
DESCRIPTION: This example shows how to attach Socket.IO to a standard Node.js HTTP server. It requires creating an HTTP server instance first, then passing it to the Socket.IO constructor, and finally starting the HTTP server to listen on a port.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io/Readme.md#_snippet_2

LANGUAGE: javascript
CODE:
```
const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});
server.listen(3000);
```

----------------------------------------

TITLE: Installing conventional-changelog CLI Globally (Bash)
DESCRIPTION: Installs the `conventional-changelog-cli` npm package globally using the `-g` flag. This command makes the `conventional-changelog` executable available in the system's PATH, allowing it to be run from any directory.

SOURCE: https://github.com/socketio/socket.io/blob/main/CONTRIBUTING.md#_snippet_7

LANGUAGE: bash
CODE:
```
npm i -g conventional-changelog-cli
```

----------------------------------------

TITLE: Installing and Using Engine.IO Client with Browserify
DESCRIPTION: This snippet illustrates how to install the Engine.IO client via npm and use it in a JavaScript file with 'require'. This code is intended to be bundled for the browser using Browserify. It shows the basic connection and event handling pattern.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-client/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
$ npm install engine.io-client
```

LANGUAGE: javascript
CODE:
```
const { Socket } = require('engine.io-client');
const socket = new Socket('ws://localhost');
socket.on('open', () => {
  socket.on('message', (data) => {});
  socket.on('close', () => {});
});
```

----------------------------------------

TITLE: Installing @socket.io/component-emitter using npm
DESCRIPTION: This command installs the `@socket.io/component-emitter` library as a dependency in your project using the npm package manager. It is the first step required before using the library in your code.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io-component-emitter/Readme.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm i @socket.io/component-emitter
```

----------------------------------------

TITLE: Starting Socket.IO Server using Node.js Cluster (Bash)
DESCRIPTION: This command executes the server script `server.js`. The script is configured to use the Node.js cluster module to spawn multiple Socket.IO server instances across CPU cores, utilizing the `@socket.io/cluster-engine` for inter-worker communication and state synchronization.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/cluster-engine-node-cluster/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
$ node server.js
```

----------------------------------------

TITLE: Running NestJS App in Production Mode using npm
DESCRIPTION: This command starts the NestJS application optimized for a production environment. It usually involves compiling the code once and running the production-ready build.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nestjs-example/README.md#_snippet_3

LANGUAGE: bash
CODE:
```
$ npm run start:prod
```

----------------------------------------

TITLE: Listening Engine.IO Server Node.js
DESCRIPTION: This snippet shows how to start an Engine.IO server that listens directly on a specified port. It demonstrates handling new connections and sending both string and binary data to connected sockets. Required dependency is the 'engine.io' module.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io/README.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
const engine = require('engine.io');
const server = engine.listen(80);

server.on('connection', socket => {
  socket.send('utf 8 string');
  socket.send(Buffer.from([0, 1, 2, 3, 4, 5])); // binary data
});
```

----------------------------------------

TITLE: Installing Engine.IO Parser via npm - Shell
DESCRIPTION: Command to install the `engine.io-parser` package using the Node Package Manager (npm), typically for use in Node.js or browser environments with bundlers like Browserify.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-parser/Readme.md#_snippet_1

LANGUAGE: Shell
CODE:
```
npm install engine.io-parser
```

----------------------------------------

TITLE: Using Socket.IO Cluster Engine with Node.js Cluster and Redis
DESCRIPTION: This Node.js example combines Node.js clustering with Redis pub/sub for communication. The primary process sets up the cluster and the Redis clients, using `setupPrimaryWithRedis`. Workers then use the `NodeClusterEngine`, which leverages the Redis setup for inter-process communication.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io-cluster-engine/README.md#_snippet_3

LANGUAGE: JavaScript
CODE:
```
import cluster from "node:cluster";
import process from "node:process";
import { availableParallelism } from "node:os";
import { createClient } from "redis";
import { setupPrimaryWithRedis, NodeClusterEngine } from "@socket.io/cluster-engine";
import { createServer } from "node:http";
import { Server } from "socket.io";

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const numCPUs = availableParallelism();

  // fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  const pubClient = createClient();
  const subClient = pubClient.duplicate();

  await Promise.all([
    pubClient.connect(),
    subClient.connect(),
  ]);

  // setup connection between and within the clusters
  setupPrimaryWithRedis(pubClient, subClient);

  // needed for packets containing Buffer objects (you can ignore it if you only send plaintext objects)
  cluster.setupPrimary({
    serialization: "advanced",
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const httpServer = createServer((req, res) => {
    res.writeHead(404).end();
  });

  const engine = new NodeClusterEngine();

  engine.attach(httpServer, {
    path: "/socket.io/"
  });

  const io = new Server();

  io.bind(engine);

  // workers will share the same port
  httpServer.listen(3000);

  console.log(`Worker ${process.pid} started`);
}
```

----------------------------------------

TITLE: Running NestJS App in Development Mode using npm
DESCRIPTION: This command starts the NestJS application in standard development mode. It typically compiles the TypeScript code and runs the resulting JavaScript.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nestjs-example/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
$ npm run start
```

----------------------------------------

TITLE: Building Socket.IO Bundle with Webpack and NPM - Shell
DESCRIPTION: This snippet provides the shell commands required to install dependencies and build the Socket.IO browser bundle using Webpack. It first installs project dependencies via `npm i` and then runs the build script defined in `package.json` via `npm run build`.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/webpack-build/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
$ npm i
$ npm run build
```

----------------------------------------

TITLE: Starting Angular Development Server (Shell)
DESCRIPTION: Run this command to start the local development server for the Angular application. It serves the app at http://localhost:4200/ and includes features like automatic reloading on file changes.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/angular-client/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
ng serve
```

----------------------------------------

TITLE: Building Angular Project (CLI)
DESCRIPTION: Compile the Angular project into output artifacts located in the `dist/` directory. This command prepares the application for deployment.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/angular-todomvc/README.md#_snippet_4

LANGUAGE: shell
CODE:
```
ng build
```

----------------------------------------

TITLE: Installing Socket.IO Cluster Engine with NPM
DESCRIPTION: This command uses the npm package manager to install the @socket.io/cluster-engine library, adding it as a dependency to your project.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io-cluster-engine/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm i @socket.io/cluster-engine
```

----------------------------------------

TITLE: Using Socket.IO with ES Modules (JavaScript)
DESCRIPTION: This example shows how to import and instantiate the Socket.IO Server class using modern ES module syntax (`import`). It then attaches the server to an existing HTTP server instance.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io/Readme.md#_snippet_4

LANGUAGE: javascript
CODE:
```
import { Server } from "socket.io";
const io = new Server(server);
io.listen(3000);
```

----------------------------------------

TITLE: Getting Angular CLI Help (Shell)
DESCRIPTION: Run this command to display help information about the Angular CLI and its commands. You can also append a command name (e.g., `ng help build`) to get help for a specific command.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/angular-client/README.md#_snippet_5

LANGUAGE: Shell
CODE:
```
ng help
```

----------------------------------------

TITLE: Example Socket.IO CONNECT Packet - JSON
DESCRIPTION: Shows the JSON structure of a Socket.IO packet used to request or confirm a connection to a specific namespace (e.g., '/admin'). The 'type' field is 0 for CONNECT.

SOURCE: https://github.com/socketio/socket.io/blob/main/docs/socket.io-protocol/v3.md#_snippet_2

LANGUAGE: json
CODE:
```
{
  "type": 0,
  "nsp": "/admin"
}
```

----------------------------------------

TITLE: Running NestJS App in Watch Mode using npm
DESCRIPTION: This command starts the NestJS application in watch mode. It's designed for development, automatically recompiling and often restarting the server when source files change.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nestjs-example/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
$ npm run start:dev
```

----------------------------------------

TITLE: Building Angular Project for Production (CLI)
DESCRIPTION: Build the Angular project with production optimizations. This command generates smaller, more efficient code suitable for a production environment, also outputting to `dist/`.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/angular-todomvc/README.md#_snippet_5

LANGUAGE: shell
CODE:
```
ng build --prod
```

----------------------------------------

TITLE: Linting and Fixing Vue.js Client Code - Bash
DESCRIPTION: This command runs code linters to check for style issues and potential errors in the project files. It can also automatically fix some issues depending on the linting configuration.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/vue-client/README.md#_snippet_3

LANGUAGE: bash
CODE:
```
yarn lint
```

----------------------------------------

TITLE: Clone Engine.IO Client Repository Bash
DESCRIPTION: This command clones the official engine.io-client Git repository from GitHub. This is the initial step for developers wanting to contribute to the project. It requires Git to be installed on the system.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-client/README.md#_snippet_8

LANGUAGE: bash
CODE:
```
git clone git://github.com/socketio/engine.io-client.git

```

----------------------------------------

TITLE: Applying Code Formatting for Specific Workspace (Bash)
DESCRIPTION: Executes the `format:fix` npm script for the `socket.io` workspace specifically. This allows contributors to format code only in the package they are modifying, which can be quicker during development.

SOURCE: https://github.com/socketio/socket.io/blob/main/CONTRIBUTING.md#_snippet_4

LANGUAGE: bash
CODE:
```
npm run format:fix --workspace=socket.io
```

----------------------------------------

TITLE: Implementing Socket.IO Packet Acknowledgement (JS)
DESCRIPTION: Provides an example of sending an event ('hello') from one side and expecting a callback (acknowledgement) from the other. It shows how the receiver handles the event and uses the provided 'ack' function to send a response back to the sender.

SOURCE: https://github.com/socketio/socket.io/blob/main/docs/socket.io-protocol/v5-current.md#_snippet_2

LANGUAGE: js
CODE:
```
// on one side
socket.emit("hello", "foo", (arg) => {
  console.log("received", arg);
});

// on the other side
socket.on("hello", (arg, ack) => {
  ack("bar");
});
```

----------------------------------------

TITLE: Example Socket.IO EVENT Packet - JSON
DESCRIPTION: Shows the JSON structure for a standard Socket.IO EVENT packet ('type': 2) sent to the default namespace ('/'). It includes an arbitrary payload in the 'data' field.

SOURCE: https://github.com/socketio/socket.io/blob/main/docs/socket.io-protocol/v3.md#_snippet_5

LANGUAGE: json
CODE:
```
{
  "type": 2,
  "nsp": "/",
  "data": ["hello", 1]
}
```

----------------------------------------

TITLE: Run Standalone Test Suite Bash
DESCRIPTION: This command executes the standalone test suite for engine.io-client, which includes both Node.js and browser tests. Running this requires 'make' and potentially a Sauce Labs account setup for browser tests via zuul as mentioned in the documentation.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-client/README.md#_snippet_7

LANGUAGE: bash
CODE:
```
make test

```

----------------------------------------

TITLE: Running Tests for Specific Workspace (Bash)
DESCRIPTION: Runs the `test` npm script specifically for the `socket.io` workspace. This allows contributors to focus on testing the changes within a single package during the development cycle, speeding up the testing process.

SOURCE: https://github.com/socketio/socket.io/blob/main/CONTRIBUTING.md#_snippet_6

LANGUAGE: bash
CODE:
```
npm test --workspace=socket.io
```

----------------------------------------

TITLE: Previewing Nuxt 3 Production Build Locally (Bash)
DESCRIPTION: These commands allow you to serve and test the production build of the Nuxt 3 application locally before deploying it. This is crucial for verifying that the built version functions as expected in an environment closer to production. Execute the command matching the package manager used for the build.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nuxt-example/README.md#_snippet_3

LANGUAGE: bash
CODE:
```
npm run preview
```

LANGUAGE: bash
CODE:
```
pnpm run preview
```

LANGUAGE: bash
CODE:
```
yarn run preview
```

LANGUAGE: bash
CODE:
```
bun run preview
```

----------------------------------------

TITLE: Integrating Socket.IO with Koa (JavaScript)
DESCRIPTION: This example shows how to integrate Socket.IO with a Koa application. It involves creating an HTTP server using the `http` module and passing the Koa application's `callback()` method to it, then attaching Socket.IO to this server.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io/Readme.md#_snippet_6

LANGUAGE: javascript
CODE:
```
const app = require('koa')();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
io.on('connection', () => { /* … */ });
server.listen(3000);
```

----------------------------------------

TITLE: Using Socket.IO Cluster Engine with Redis Pub/Sub
DESCRIPTION: This Node.js example demonstrates configuring Socket.IO with the RedisEngine. It involves setting up Redis clients for publishing and subscribing and then attaching the engine to an HTTP server and binding it to the Socket.IO server instance.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io-cluster-engine/README.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
import { createServer } from "node:http";
import { createClient } from "redis";
import { RedisEngine } from "@socket.io/cluster-engine";
import { Server } from "socket.io";

const httpServer = createServer((req, res) => {
  res.writeHead(404).end();
});

const pubClient = createClient();
const subClient = pubClient.duplicate();

await Promise.all([
  pubClient.connect(),
  subClient.connect(),
]);

const engine = new RedisEngine(pubClient, subClient);

engine.attach(httpServer, {
  path: "/socket.io/"
});

const io = new Server();

io.bind(engine);

httpServer.listen(3000);
```

----------------------------------------

TITLE: Building Nuxt 3 Application for Production (Bash)
DESCRIPTION: These commands compile and optimize the Nuxt 3 application code for production deployment. The build process typically generates static assets and server-side rendering bundles (if applicable) in a .output or dist directory. Run the command corresponding to your package manager to prepare the application for hosting.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nuxt-example/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm run build
```

LANGUAGE: bash
CODE:
```
pnpm run build
```

LANGUAGE: bash
CODE:
```
yarn build
```

LANGUAGE: bash
CODE:
```
bun run build
```

----------------------------------------

TITLE: Initializing Engine.IO Client in Browser (Standalone)
DESCRIPTION: This snippet shows how to include the standalone Engine.IO client script in an HTML page and connect to an Engine.IO server. It demonstrates basic event handling for 'open', 'message', and 'close'. It also includes an example of setting `binaryType` and sending/receiving binary data.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-client/README.md#_snippet_0

LANGUAGE: html
CODE:
```
<script src="/path/to/engine.io.js"></script>
<script>
  // eio = Socket
  const socket = eio('ws://localhost');
  socket.on('open', () => {
    socket.on('message', (data) => {});
    socket.on('close', () => {});
  });
</script>
```

LANGUAGE: html
CODE:
```
<script src="/path/to/engine.io.js"></script>
<script>
  const socket = eio('ws://localhost/');
  socket.binaryType = 'blob';
  socket.on('open', () => {
    socket.send(new Int8Array(5));
    socket.on('message', (blob) => {});
    socket.on('close', () => {});
  });
</script>

----------------------------------------

TITLE: Run Local Browser Tests using Zuul Bash
DESCRIPTION: This command executes the browser test suite for engine.io-client locally using the zuul test runner. It starts a local server on port 8080 and runs the tests specified in test/index.js. This requires zuul to be installed and configured locally.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-client/README.md#_snippet_6

LANGUAGE: bash
CODE:
```
./node_modules/.bin/zuul --local 8080 -- test/index.js

```

----------------------------------------

TITLE: Connecting Engine.IO Client Browser JavaScript
DESCRIPTION: This HTML script demonstrates connecting to an Engine.IO server from a browser using the client library (`engine.io.js`). It shows how to create a new `eio.Socket` instance and handle 'open', 'message', and 'close' events. The client library must be included via a `<script>` tag.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io/README.md#_snippet_3

LANGUAGE: HTML
CODE:
```
<script src="/path/to/engine.io.js"></script>
<script>
  const socket = new eio.Socket('ws://localhost/');
  socket.on('open', () => {
    socket.on('message', data => {});
    socket.on('close', () => {});
  });
</script>
```

----------------------------------------

TITLE: Stopping Specific Service - Shell
DESCRIPTION: This command stops a named service (`server-george`) within the running Docker Compose setup. It is provided as an example to test the application's resilience by stopping a single Socket.IO node and observing client reconnection. Requires Docker Compose to be active.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/cluster-haproxy/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
$ docker-compose stop server-george
```

----------------------------------------

TITLE: Running Unit Tests for NestJS App using npm
DESCRIPTION: This command executes the unit tests defined for the NestJS application. Unit tests verify individual components or functions in isolation.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nestjs-example/README.md#_snippet_4

LANGUAGE: bash
CODE:
```
$ npm run test
```

----------------------------------------

TITLE: Running End-to-End Tests for NestJS App using npm
DESCRIPTION: This command executes the end-to-end (e2e) tests for the NestJS application. E2e tests simulate user scenarios to test the entire application flow.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nestjs-example/README.md#_snippet_5

LANGUAGE: bash
CODE:
```
$ npm run test:e2e
```

----------------------------------------

TITLE: Instantiating Engine.IO Server Node.js
DESCRIPTION: These examples show various ways to create and attach an Engine.IO `Server` instance using the top-level `require('engine.io')` function. It covers creating first and then attaching, calling the module as a function, immediate attachment, and attachment with custom options. Requires an existing `http.Server` instance.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io/README.md#_snippet_4

LANGUAGE: JavaScript
CODE:
```
const httpServer; // previously created with `http.createServer();` from node.js api. 

// create a server first, and then attach
const eioServer = require('engine.io').Server();
eioServer.attach(httpServer);

// or call the module as a function to get `Server`
const eioServer = require('engine.io')();
eioServer.attach(httpServer);

// immediately attach
const eioServer = require('engine.io')(httpServer);

// with custom options
const eioServer = require('engine.io')(httpServer, {
  maxHttpBufferSize: 1e3
});
```

----------------------------------------

TITLE: Defining and Connecting to Socket.IO Namespaces - JavaScript
DESCRIPTION: Demonstrates defining a custom namespace ('/admin') on the server side and handling new connections within that namespace. Also shows how a client connects to both the default namespace and a specific namespace.

SOURCE: https://github.com/socketio/socket.io/blob/main/docs/socket.io-protocol/v3.md#_snippet_0

LANGUAGE: javascript
CODE:
```
// server-side
const nsp = io.of("/admin");
nsp.on("connect", socket => {});

// client-side
const socket1 = io(); // default namespace
const socket2 = io("/admin");
socket2.on("connect", () => {});
```

----------------------------------------

TITLE: Example Engine.IO JSONP Frame Output
DESCRIPTION: This string shows an example of the JavaScript code returned by the server for the JSONP polling transport. It wraps the encoded payload within a function call specified by the 'j' query parameter provided by the client.

SOURCE: https://github.com/socketio/socket.io/blob/main/docs/engine.io-protocol/v3.md#_snippet_5

LANGUAGE: text
CODE:
```
___eio[4]("packet data");
```

----------------------------------------

TITLE: Generating Test Coverage Report using npm
DESCRIPTION: This command runs the tests (usually unit and/or e2e) and generates a code coverage report. The report shows what percentage of the codebase is executed by the tests.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/nestjs-example/README.md#_snippet_6

LANGUAGE: bash
CODE:
```
$ npm run test:cov
```

----------------------------------------

TITLE: Integrating Express Middlewares with Engine.IO Node.js
DESCRIPTION: This snippet illustrates how to integrate standard Express-style middlewares directly with the Engine.IO server instance using the `engine.use()` method. This allows processing incoming HTTP requests (including upgrade requests) with common middlewares like session management or security headers before they are handled by Engine.IO. The middleware function signature is `(req, res, next)`, where `next()` must be called to proceed to the next middleware or the Engine.IO handler. Examples show using a custom middleware, `express-session`, and `helmet`. Requires the respective middleware packages like `express-session` or `helmet` to be installed.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io/CHANGELOG.md#_snippet_1

LANGUAGE: javascript
CODE:
```
engine.use((req, res, next) => {
  // do something

  next();
});

// with express-session
import session from "express-session";

engine.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// with helmet
import helmet from "helmet";

engine.use(helmet());
```

----------------------------------------

TITLE: Initializing Engine.IO Client in Node.js
DESCRIPTION: This snippet demonstrates the basic usage of the Engine.IO client in a Node.js environment. It requires the module and creates a new Socket instance, setting up listeners for standard events like 'open', 'message', and 'close'.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-client/README.md#_snippet_2

LANGUAGE: javascript
CODE:
```
const { Socket } = require('engine.io-client');
const socket = new Socket('ws://localhost');
socket.on('open', () => {
  socket.on('message', (data) => {});
  socket.on('close', () => {});
});
```

----------------------------------------

TITLE: Example Engine.IO Handshake Payload (v6.2.0)
DESCRIPTION: This snippet shows an example of the JSON payload sent during the engine.io handshake, illustrating the addition of the 'maxPayload' field in version 6.2.0. This field helps HTTP long-polling clients determine the maximum allowed packet size.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io/CHANGELOG.md#_snippet_4

LANGUAGE: JSON
CODE:
```
0{"sid":"lv_VI97HAXpY6yYWAAAC","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":5000,"maxPayload":1000000}
```

----------------------------------------

TITLE: Running Socket.IO Server Standalone (JavaScript)
DESCRIPTION: This snippet demonstrates creating and running a Socket.IO server instance directly, allowing it to listen on a specified port without explicitly creating a separate HTTP server instance beforehand.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io/Readme.md#_snippet_3

LANGUAGE: javascript
CODE:
```
const io = require('socket.io')();
io.on('connection', client => { ... });
io.listen(3000);
```

----------------------------------------

TITLE: Generating Angular Component (CLI)
DESCRIPTION: Use this command with the Angular CLI to generate a new component. Replace `component-name` with the desired name for your component.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/angular-todomvc/README.md#_snippet_2

LANGUAGE: shell
CODE:
```
ng generate component component-name
```

----------------------------------------

TITLE: Running Angular End-to-End Tests (Protractor)
DESCRIPTION: Run the end-to-end tests for the application via the Protractor framework. This tests the application flow from a user's perspective.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/angular-todomvc/README.md#_snippet_7

LANGUAGE: shell
CODE:
```
ng e2e
```

----------------------------------------

TITLE: Encoded Payload Example (String Only)
DESCRIPTION: This string shows the encoded format for a payload containing only string data when XHR2 is not supported. It consists of character length-prefixed packets concatenated together, using ':' as a separator.

SOURCE: https://github.com/socketio/socket.io/blob/main/docs/engine.io-protocol/v3.md#_snippet_2

LANGUAGE: text
CODE:
```
6:4hello2:4€
```

----------------------------------------

TITLE: Integrating Socket.IO with Fastify (JavaScript)
DESCRIPTION: This snippet demonstrates integrating Socket.IO with a Fastify application using the `fastify-socket.io` plugin. After registering the plugin, the Socket.IO instance is accessible via the `app.io` decorator within the `ready()` promise.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io/Readme.md#_snippet_7

LANGUAGE: javascript
CODE:
```
const app = require('fastify')();
app.register(require('fastify-socket.io'));
app.ready().then(() => {
    app.io.on('connection', () => { /* … */ });
})
app.listen(3000);
```

----------------------------------------

TITLE: Running Socket.IO Tests (Bash)
DESCRIPTION: This command executes the test suite for the Socket.IO project using npm. It runs the associated gulp task and by default tests the source code in the `lib` directory.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io/Readme.md#_snippet_9

LANGUAGE: bash
CODE:
```
npm test
```

----------------------------------------

TITLE: Example Socket.IO ERROR Packet - JSON
DESCRIPTION: Illustrates the JSON structure for an ERROR packet ('type': 4), typically sent by the server to indicate a failure, such as a refused namespace connection. It can include a descriptive payload.

SOURCE: https://github.com/socketio/socket.io/blob/main/docs/socket.io-protocol/v3.md#_snippet_8

LANGUAGE: json
CODE:
```
{
  "type": 4,
  "nsp": "/admin",
  "data": "Not authorized"
}
```

----------------------------------------

TITLE: Example Socket.IO DISCONNECT Packet - JSON
DESCRIPTION: Illustrates the JSON structure of a Socket.IO packet used by one side to signal disconnection from a specific namespace (e.g., '/admin'). The 'type' field is 1 for DISCONNECT.

SOURCE: https://github.com/socketio/socket.io/blob/main/docs/socket.io-protocol/v3.md#_snippet_4

LANGUAGE: json
CODE:
```
{
  "type": 1,
  "nsp": "/admin"
}
```

----------------------------------------

TITLE: Example Engine.IO Message Payload JSON
DESCRIPTION: This JSON array represents a typical payload containing multiple message packets before encoding for transmission. Each object in the array corresponds to a single packet with a type and associated data.

SOURCE: https://github.com/socketio/socket.io/blob/main/docs/engine.io-protocol/v3.md#_snippet_1

LANGUAGE: json
CODE:
```
[
  {
    "type": "message",
    "data": "hello"
  },
  {
    "type": "message",
    "data": "€"
  }
]
```

----------------------------------------

TITLE: Handling Socket.IO Events (JavaScript)
DESCRIPTION: This snippet shows the basic structure for handling connections and events on the Socket.IO server. It demonstrates listening for new client connections, emitting events to a specific socket or broadcasting to all connected sockets, and listening for specific events sent from a client.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/socket.io/Readme.md#_snippet_0

LANGUAGE: javascript
CODE:
```
io.on('connection', socket => {
  socket.emit('request', /* … */); // emit an event to the socket
  io.emit('broadcast', /* … */); // emit an event to all connected sockets
  socket.on('reply', () => { /* … */ }); // listen to the event
});
```

----------------------------------------

TITLE: Bundling JavaScript Code with Browserify - Bash
DESCRIPTION: Command to bundle a JavaScript application file (`app.js`) that uses `require` statements into a single file (`bundle.js`) using Browserify, making it suitable for inclusion in a web page.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-parser/Readme.md#_snippet_3

LANGUAGE: Bash
CODE:
```
$ browserify app.js > bundle.js
```

----------------------------------------

TITLE: Change Directory to Project Root Bash
DESCRIPTION: This command changes the current working directory to the root directory of the cloned engine.io-client repository. This is necessary before running further commands within the project context, such as installing dependencies or running tests.

SOURCE: https://github.com/socketio/socket.io/blob/main/packages/engine.io-client/README.md#_snippet_9

LANGUAGE: bash
CODE:
```
cd engine.io-client

```

----------------------------------------

TITLE: Running Angular End-to-End Tests (Shell)
DESCRIPTION: Use this command to run end-to-end tests, which simulate user interaction with the application running in a real browser. Requires an end-to-end testing framework package to be installed.

SOURCE: https://github.com/socketio/socket.io/blob/main/examples/basic-crud-application/angular-client/README.md#_snippet_4

LANGUAGE: Shell
CODE:
```
ng e2e
```