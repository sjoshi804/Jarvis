// External modules
import express = require("express");
const cookieParser = require('cookie-parser');
import http = require("http");
import path = require("path");

// Config
import config = require("../.config");

// Core modules
import { DBClient } from "./db/dbClient";
import { logger } from "./middleware/logger";

// Routers
import { TemplateRouter } from "./apps/templateApp/routes";

// Express configuration
let port = process.env.PORT || 3000;
const app = express();
app.set("port", port);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Initialize logger if non test environment (avoid cluttering stdout due to many API requests in test)
if (process.env.NODE_ENV != config.test) {
  app.use(logger);
}

// Connect Base Endpoints to Routers
app.use("/template", TemplateRouter);

//Serve react app build if in production
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../../client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Initialize a db connection
DBClient.connect();

// Start server
var server = http.createServer(app);

// Start listening on server
server.listen(app.get("port"), () => {
  console.log(`Server is listening on port ${port}`);
});

// Register signal handlers
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

// Close database connection and terminate server gracefully
function shutDown() {
  DBClient.close();
  console.log("Closing db connection")
  server.close(() => {
    console.log('Terminating server');
    process.exit(0);
  });
}

// Export server object for testing purposes
export default server;