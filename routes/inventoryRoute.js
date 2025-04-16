const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index");


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//route to build inventory by item view
router.get("/detail/:invId", invController.buildByItemId);
router.get("/type/error", invController.buildErrorView);
//route to build the add-inventory.ejs view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

module.exports = router; 