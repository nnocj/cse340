const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
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

async function buildByItemId(req, res, next) {
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

async function buildErrorView(res, next) {
 
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


async function buildInventory (req, res, next) {
  let nav = await utilities.getNav()
  let classificationOptionList = await utilities.buildClassificationOptionList();
  res.render("./inventory/add-inventory",{
    title: "Add Inventory",
    nav,
    classificationOptionList,
    errors: null,
  })
}

async function buildClassification (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification",{
    title: "Add Classification",
    nav,
    errors: null,
  })
}


async function addInventory(req, res) {
 let nav = await utilities.getNav();
       const {classification_id, inv_make, inv_model,inv_year,inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,inv_color} = req.body;
      
       const inventoryCreationResult = await invModel.addInventory( inv_make, inv_model,inv_year,inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,inv_color,classification_id);
 
       if (inventoryCreationResult) {
         req.flash("notice", `${inv_year} ${inv_make} ${inv_model} has been added successfully!`);
         res.status(201).render("inventory/management", {
           title: "Vehicle Management",
           nav,
           error: null,
         })
       }
       else { // this ensure that there is always a chance to try again.
        let classificationOptionList = await utilities.buildClassificationOptionList();
        req.flash("notice", `Sorry! the submission attempt was unsuccessful. Please try again`);
         res.status(501).render("./inventory/add-inventory", {
         title: "Add Inventory",
         nav,
         classificationOptionList,
        }) 
       }
    
}

async function addClassification(req, res) {
  let nav = await utilities.getNav();
        const {classification_name} = req.body;

        //check if classification exists before adding it to the database.
        const classificationExists = await invModel.getClassificationByName(classification_name);
        if (classificationExists) {
          req.flash("notice", `${classification_name} already exists!\nPlease enter another classification name`);
          res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            error: null,
          })
        }
        else { 
          const addClassificationResult = await invModel.addClassification( classification_name);
        
              if (addClassificationResult) {
                req.flash("notice", `${classification_name} has been added successfully!`);
                res.status(201).render("inventory/management", {
                  title: "Vehicle Management",
                  nav,
                  error: null,
                })
              }
              else { // this ensure that there is always a chance to try again.
              req.flash("notice", `Sorry! the submission attempt was unsuccessful. Please try again`);
                res.status(501).render("./inventory/add-classification", {
                title: "Add Classification",
                nav,
              }) 
            }
        }
 }

module.exports = {buildByItemId, addInventory, buildErrorView, buildInventory, buildClassification, buildByClassificationId, addClassification};