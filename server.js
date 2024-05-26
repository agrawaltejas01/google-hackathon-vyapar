const express = require("express");
const cors = require("cors");
const handler = require("./handler/statement");

// Create Express app
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

// Define another route, for example, a GET method to retrieve data
app.get("/users", handler.getUserNames);
app.get("/users/account/:username", handler.getUserData);

// Set the server to listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
