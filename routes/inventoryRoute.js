const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index");
const upload = require("../middleware/upload")
const invValidate = require("../utilities/inventory-validation")
const checkJWTToken = require("../middleware/json-web-token");
const checkUserType = require("../middleware/check-user-type");

/***************************************
 * **** Secured Routes ************
 * Here I also fulfil the week 5 assignment to check the authority of user and credentials before access.
 * ***********************************/
// route to obtain an item for deletion
router.get("/authorizedDeleteInventory/:inv_id", checkJWTToken.checkJWTToken, checkUserType.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildDeleteInventory));
// route to delete the inventory data of a particular vehicle
router.post("/authorizedDeleteInventory/:inv_id", checkJWTToken.checkJWTToken, checkUserType.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteInventory));
//
// route to get the inventory data of a classification in a json format: Server to client communication
router.get("/authorizedGetInventory/:classification_id", checkJWTToken.checkJWTToken, checkUserType.checkEmployeeOrAdmin, utilities.handleErrors(invController.getInventoryJSON));
// route to load the edit inventory page of a particular vehicle
router.get("/authorizedEditInventory/:inv_id", checkJWTToken.checkJWTToken, checkUserType.checkEmployeeOrAdmin,  utilities.handleErrors(invController.buildEditInventory));
// route to update the inventory data of a particular vehicle
router.post("/authorizedEditInventory/:inv_id", checkJWTToken.checkJWTToken, checkUserType.checkEmployeeOrAdmin, upload.fields([ { name: "inv_image", maxCount: 1 }, { name: "inv_thumbnail", maxCount: 1 }]), invValidate.editInventoryRules(), invValidate.checkEdittedData, utilities.handleErrors(invController.editInventory));
//route to build the add-inventory.ejs view
router.get("/add-inventory", checkJWTToken.checkJWTToken, checkUserType.checkEmployeeOrAdmin,  utilities.handleErrors(invController.buildInventory));
// addding inventory to the database in this case the vehicles.
router.post("/add-inventory",  checkJWTToken.checkJWTToken, checkUserType.checkEmployeeOrAdmin, upload.fields([{name: "inv_image", maxCount:1},{name: "inv_thumbnail", maxCount:1}]), invValidate.inventoryCreationRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))



/*****************************************
 * **** Public/General Routes ************
 * ****************************************/

// default route to access the manage inventory page
router.get("/", utilities.handleErrors(invController.buildInventoryManager));

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//route to build inventory by item view
router.get("/detail/:invId", invController.buildByItemId);
router.get("/type/error", invController.buildErrorView);
// route to build the add-classification.ejs view
router.get("/add-classification", utilities.handleErrors(invController.buildClassification));
// addding classification to the database
router.post("/add-classification", invValidate.addClassificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification))

module.exports = router; 