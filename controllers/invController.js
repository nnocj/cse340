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
  const data = await invModel.getInventoryByInvId(inv_id)
  const view = await utilities.buildInventoryItemView(data)
  let nav = await utilities.getNav()
  const invYear = data[0].inv_year;
  const invMake = data[0].inv_make;
  const invModel = data[0].inv_model;
  res.render("./inventory/item", {
    title: invYear + " " + invMake + " " + invModel,
    nav,
    view,
  })
}

module.exports = invCont
