const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index");
const upload = require("../middleware/upload")
const invValidate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//route to build inventory by item view
router.get("/detail/:invId", invController.buildByItemId);
router.get("/type/error", invController.buildErrorView);
//route to build the add-inventory.ejs view
router.get("/add-inventory", utilities.handleErrors(invController.buildInventory));
// addding inventory to the database in this case the vehicles.
router.post("/add-inventory",upload.fields([{name: "inv_image", maxCount:1},{name: "inv_thumbnail", maxCount:1}]), invValidate.inventoryCreationRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))
// route to build the add-classification.ejs view
router.get("/add-classification", utilities.handleErrors(invController.buildClassification));
// addding classification to the database
router.post("/add-classification", invValidate.addClassificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification))

module.exports = router; 