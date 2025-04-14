const express = require("express");
const env = require("dotenv").config();
const app = express();
const session = require("express-session");
const pool = require("./database/");

const expressEjsLayouts = require("express-ejs-layouts");

const staticRoutes = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities"); 


/* ***********************
 * Session Secret Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sectionId',
}))

//Express Message Middleware
app.use(require('connect-flash')())
app.use(function(req,res, next){
  res.locals.messages = require('express-messages')(req,res)
  next()
})

// View Engine Setup
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", "./layouts/layout");

// Middleware & Routes
app.use(express.static("public")); 
app.use(staticRoutes);
app.use("/inv", inventoryRoute);

// Home Route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Test Error Route
app.get("/test-error", (req, res, next) => {
  next(new Error("This is a test error")); 
});

// 404 Not Found Handler
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page."
  });
});

/* ***********************
 * Global Error Handler
 ************************ */
app.use(async (err, req, res, next) => {

  const nav = await utilities.getNav(); 
  console.error(`Error at "${req.originalUrl}": ${err.message}`);
  if (err.status === 404){
    message = err.message
  }

  else {
    message = "Oh no! there was a crash. Maybe try a different route?";
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav
  });
});

// Start Server
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
