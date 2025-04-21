const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
 
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  const grid = await utilities.buildClassificationGrid(data)
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

async function buildInventoryManager (req, res, next) {
  let nav = await utilities.getNav()
  let classificationOptionList = await utilities.buildClassificationOptionList();
  res.render("./inventory/management",{
    title: "Vehicle Management",
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
        let classificationOptionList = await utilities.buildClassificationOptionList();
         req.flash("notice", `${inv_year} ${inv_make} ${inv_model} has been added successfully!`);
         res.status(201).render("inventory/management", {
           title: "Vehicle Management",
           nav,
           classificationOptionList,
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


async function editInventory(req, res) {
  let nav = await utilities.getNav();
        let { inv_id, inv_make, inv_model,inv_year,inv_description, existing_image, existing_thumbnail, inv_price, inv_miles,inv_color, classification_id} = req.body;
        
        //I'm checking for new upload images and thumbnails from multer
      
        // Use uploaded files only if available
        const inv_image = req.files?.inv_image ? '/images/vehicles/' + req.files.inv_image[0].filename : existing_image;
        const inv_thumbnail = req.files?.inv_thumbnail ? '/images/vehicles/' + req.files.inv_thumbnail[0].filename : existing_thumbnail;

        const inventoryUpdateResult = await invModel.editInventory( inv_id, inv_make, inv_model,inv_year,inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
  
        if (inventoryUpdateResult) {
         let classificationOptionList = await utilities.buildClassificationOptionList();
          req.flash("notice", `${inv_year} ${inv_make} ${inv_model} has been editted successfully!`);
          res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationOptionList,
            errors: []
          })
        }
        else { // this ensure that there is always a chance to try again.
         let classificationOptionList = await utilities.buildClassificationOptionList(classification_id);
         req.flash("notice", `Sorry! the submission attempt was unsuccessful. Please try again`);
          res.status(501).render("./inventory/edit-inventory", {
          title: "Add Inventory",
          nav,
          classificationOptionList,
          errors : null,
          inv_id,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id

         }) 
        }
      }


async function deleteInventory(req, res) {
        let nav = await utilities.getNav();
        const inv_id = parseInt(req.params.inv_id)
        const rawInvData = await invModel.getInventoryDetailsByInventoryId(inv_id);
        //even if there is only one item, database calls may return an array of row
        //so i have placed this help me avoid the errors of not displaying at the client.
        const invData = Array.isArray(rawInvData) ? rawInvData[0] : rawInvData;
        console.log("Inventory Data: ", invData);
              
              
              const inventoryDeleteResult = await invModel.deleteInventory(inv_id);
        
              if (inventoryDeleteResult) {
               let classificationOptionList = await utilities.buildClassificationOptionList();
                req.flash("notice", `${invData.inv_year} ${invData.inv_make} ${invData.inv_model} has been deleted successfully!`);
                res.status(201).render("inventory/management", {
                  title: "Vehicle Management",
                  nav,
                  classificationOptionList,
                  error: null,
                })
              }
              else { // this ensure that there is always a chance to try again.
               let classificationOptionList = await utilities.buildClassificationOptionList(classification_id);
               req.flash("notice", `Sorry! the deletion attempt was unsuccessful. Please try again`);
                res.status(501).render("./inventory/delete-inventory", {
                title: "Delete Vehicle",
                nav,
                classificationOptionList,
                error: null,
                inv_id,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
                classification_id,

                
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

 // the purpose of this function is to convert the inventory data to a json format to be used by the client side.
 async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id); //to ensure its an integer
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData) {
    res.status(200).json(invData);
   
  } else {
    res.status(404).json({ message: "No inventory found for this classification."});
  }  

 }

//it fetches to populates the entry feilds because its an update page. 
// this will allow users to see what already exist to know the changes to make.
async function buildEditInventory(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  console.log("------ inv_id -----: ", inv_id);

  // Prevent invalid inv_id from reaching the DB
  if (!inv_id) {
    req.flash("notice", "Invalid inventory ID.");
    return res.redirect("/inv"); // or send a 400 error
  }

  try {
    const rawInvData = await invModel.getInventoryDetailsByInventoryId(inv_id);
    //even if there is only one item, database calls may return an array of row
    //so i have placed this help me avoid the errors of not displaying at the client.
    const invData = Array.isArray(rawInvData) ? rawInvData[0] : rawInvData;
    console.log("Inventory Data: ", invData);

    if (!invData || invData.length === 0) {
      req.flash("notice", "Inventory item not found.");
      return res.redirect("/inv"); // or res.status(404).render("your-404-page")
    }
    //preselect the classification based on what is in the data
    const classificationOptionList = await utilities.buildClassificationOptionList(invData.classification_id);


    let nav = await utilities.getNav();
    const itemName =  `Edit ${invData.inv_year} ${invData.inv_make} ${invData.inv_model}`;

    res.render("./inventory/edit-inventory", {
      title: itemName,
      nav,
      classificationOptionList: classificationOptionList,
      errors: null,
      inv_id: invData.inv_id,
      inv_make: invData.inv_make,
      inv_model: invData.inv_model,
      inv_year: invData.inv_year,
      inv_description: invData.inv_description,
      inv_image: invData.inv_image,
      inv_thumbnail: invData.inv_thumbnail,
      inv_price: invData.inv_price,
      inv_miles: invData.inv_miles,
      inv_color: invData.inv_color,
      classification_id: invData.classification_id,
    });

  } catch (error) {
    console.error("buildEditInventory error:", error);
    next(error); // Let your error middleware handle this
  }
}

async function buildDeleteInventory(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  console.log("------ inv_id -----: ", inv_id);

  // Prevent invalid inv_id from reaching the DB
  if (!inv_id) {
    req.flash("notice", "Invalid inventory ID.");
    return res.redirect("/inv"); // or send a 400 error
  }

  try {
    const rawInvData = await invModel.getInventoryDetailsByInventoryId(inv_id);
    //even if there is only one item, database calls may return an array of row
    //so i have placed this help me avoid the errors of not displaying at the client.
    const invData = Array.isArray(rawInvData) ? rawInvData[0] : rawInvData;
    console.log("Inventory Data: ", invData);

    if (!invData || invData.length === 0) {
      req.flash("notice", "Inventory item not found.");
      return res.redirect("/inv"); // or res.status(404).render("your-404-page")
    }
    //preselect the classification based on what is in the data
    const classificationOptionList = await utilities.buildClassificationOptionList(invData.classification_id);


    let nav = await utilities.getNav();
    const itemName =  `Delete ${invData.inv_year} ${invData.inv_make} ${invData.inv_model}`;

    res.render("./inventory/delete-inventory", {
      title: itemName,
      nav,
      classificationOptionList: classificationOptionList,
      errors: null,
      inv_id: invData.inv_id,
      inv_make: invData.inv_make,
      inv_model: invData.inv_model,
      inv_year: invData.inv_year,
      inv_description: invData.inv_description,
      inv_image: invData.inv_image,
      inv_thumbnail: invData.inv_thumbnail,
      inv_price: invData.inv_price,
      inv_miles: invData.inv_miles,
      inv_color: invData.inv_color,
      classification_id: invData.classification_id,
    });

  } catch (error) {
    console.error("buildDeleteInventory error:", error);
    next(error); // Let your error middleware handle this
  }
}


module.exports = {buildByItemId, addInventory, buildErrorView, buildInventory, 
  buildInventoryManager, buildClassification, buildByClassificationId, addClassification, 
  getInventoryJSON, buildEditInventory, editInventory, deleteInventory,
  buildDeleteInventory};