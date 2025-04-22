/***************************************
 *             DEPENDENCIES
 ***************************************/
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const flash = require("connect-flash");
const expressMessages = require("express-messages");
const expressEjsLayouts = require("express-ejs-layouts");
const pgSession = require("connect-pg-simple")(session);
const cookieParser = require("cookie-parser");
const middleware = require("./middleware/json-web-token");

const app = express();

/***************************************
 *             MODULES
 ***************************************/
const pool = require("./database/");
const staticRoutes = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities");

/***************************************
 *         MIDDLEWARE SETUP
 ***************************************/

// Body Parser Middleware
app.use(cookieParser()); //week 5 which i defined or utilized in the upload.js of the middleware folder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Json Web TokenMiddleware
app.use(middleware.checkJWTToken);// this will be take care of my authentications.
// Static Files Middleware
//app.use(express.static("public"));


// Session Middleware
app.use(
  session({
    store: new pgSession({     //useful both local and online production
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Flash Messages Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Middleware to expose session info to views
app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin || false;
  res.locals.firstname = req.session.firstname || "";
  next();
});

/***************************************
 *         VIEW ENGINE SETUP
 ***************************************/
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", "./layouts/layout");

/***************************************
 *              ROUTES
 ***************************************/

// Base route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Feature-specific routes
app.use("/account", accountRoute);
app.use("/inv", inventoryRoute);

// Static & informational routes
app.use(staticRoutes);

// Error testing route
app.get("/test-error", (req, res, next) => {
  next(new Error("This is a test error"));
});

/***************************************
 *        404 ERROR HANDLER
 ***************************************/
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  });
});

/***************************************
 *        GLOBAL ERROR HANDLER
 ***************************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  const status = err.status || 500;
  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  console.error(`❌ Error at "${req.originalUrl}": ${err.message}`);

  res.status(status).render("errors/error", {
    title: status,
    message,
    nav,
  });
});

/***************************************
 *            START SERVER
 ***************************************/
/*const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`🚀 Server is running at http://${host}:${port}`);
});*/


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
