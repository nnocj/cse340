const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByItemId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryDetailsByInventoryId(inv_id)
  const grid = await utilities.buildInventoryItemView(data)
  let nav = await utilities.getNav()
  const invYear = data[0].inv_year;
  const invMake = data[0].inv_make;
  const invModelName = data[0].inv_model;
  res.render("./inventory/classification", {
    title: invYear + " " + invMake + " " + invModelName,
    nav,
    grid,
  })
}

invCont.buildErrorView = async function (res, next) {
 
  let nav = await utilities.getNav()
  let message = `<h1>Server Error</h1>
                <div id="error-message-container">
                    <p>Oh no!, there was a crash. Maybe try a different route.</p>
                </div>`   
  res.render("./errors/error", {
    nav,
    message,
  })
}

invCont.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationOptionList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    error: null,
  })
}

module.exports = invCont
