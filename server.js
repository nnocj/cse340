const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const expressEjsLayouts = require("express-ejs-layouts");

// Set up view engine
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", "./layouts/layout");

// Routes
app.use(static);
app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});
// Ensure PORT is set, or use 3000 as default
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

// Start server
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
