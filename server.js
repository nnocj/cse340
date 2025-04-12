const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

const expressEjsLayouts = require("express-ejs-layouts");

const staticRoutes = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities"); 

// View Engine Setup
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", "./layouts/layout");

// Middleware & Routes
app.use(express.static("public")); 
app.use(staticRoutes);
app.use("/inv", inventoryRoute);

// Home Route
app.get("/", baseController.buildHome);

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

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message || "Something went wrong.",
    nav
  });
});

// Start Server
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
