const utilities = require("../utilities/index");
// body is to access data while validateResult contains errors detected by validation
const {body, validationResult} = require("express-validator");
const invModel = require("../models/inventory-model");
const inventoryValidate = {};


/*  **********************************
  *  Inventory Creation Data Validation Rules
  * ********************************* */ 
 inventoryValidate.inventoryCreationRules = ()=>{
    return [

        body("classification_id")
        .notEmpty()
        .withMessage("Please select a classification."),
        
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min:1})
            .withMessage("Please provide the item name"),// on error this message is sent.

            body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide the item model"),

            body("inv_year")
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Must be a number")
            .isLength({min:4, max:4})
            .withMessage("Year muist be 4 digits long."),

            body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 10})
            .withMessage("Please ensure that your description is at least 10 characters long"),

            body("inv_price")
            .notEmpty()
            .isFloat({min: 0})
            .withMessage("Price must only be a positive number."),
            
            body("inv_miles")
            .notEmpty()
            .isInt({min: 0})
            .withMessage("Mileage must have a positive integer."),

            
            body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color is required."),

         

    ];
 }

 /****************************************************
  * * Check Validation Data  and Return errors ****8*****
  *******************************************/
inventoryValidate.checkInventoryData = async (req, res, next) => {
    let { classification_id, inv_make, inv_model, inv_year, inv_description,inv_price, inv_miles, inv_color} = req.body

     // Rebuild file paths from multer. this is a way so that they can be used in the form when the page is loading due to the post action
    // If you uploaded a file, construct file paths
    const formated_inv_image = req.savedImageName ? `/images/vehicles/${req.savedImageName}` : "";
    const formated_inv_thumbnail = req.savedThumbnailName ? `/images/vehicles/${req.savedThumbnailName}` : "";

    req.body.inv_image = formated_inv_image;
    req.body.inv_thumbnail = formated_inv_thumbnail;
    //manual checks because it would need to be formated in order to match.
    //if i write it in the rules, i will probably have to restate all this rules here as it would be lost after the inventoryCreationRules
    const imageRegex = /^\/images\/vehicles\/[\w\-]+\.(jpg|jpeg|png|webp)$/i;
    const thumbnailRegex = /^\/images\/vehicles\/[\w\-]+-tn\.(jpg|jpeg|png|webp)$/i;

    let errors = []
    if (!imageRegex.test(formated_inv_image)) {
        errors.push({msg: "Image file is required.\nImage path must follow the format: /images/vehicles/filename.jpg"});
    }
    if (!thumbnailRegex.test(formated_inv_thumbnail)) {
        errors.push({msg: "Thumbnail file is required.\nThumbnail must follow the format: /images/vehicles/filename-tn.jpg"})
    }

    
    // check for errors in the validate result
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationOptionList = await utilities.buildClassificationOptionList();
        res.render("inventory/add-inventory", {
            errors: errors.array(), //flatten errors before sending to the view
            title: "Add Inventory",
            nav,
            classificationOptionList, //this is the list of classifications to be used in the form when the page is loading due to the post action
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            formated_inv_image,
            formated_inv_thumbnail,// now its fetched and added to the body of the request.
            inv_price,
            inv_miles,
            inv_color,

        })
        return
    }
    next()// if no errors then continue to the next middleware.
}

/*  **********************************
  *  Inventory Creation Data Validation Rules
  * ********************************* */ 
inventoryValidate.editInventoryRules = ()=>{
    return [

        body("classification_id")
        .notEmpty()
        .withMessage("Please select a classification."),
        
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min:1})
            .withMessage("Please provide the item name"),// on error this message is sent.

            body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide the item model"),

            body("inv_year")
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Must be a number")
            .isLength({min:4, max:4})
            .withMessage("Year muist be 4 digits long."),

            body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 10})
            .withMessage("Please ensure that your description is at least 10 characters long"),

            body("inv_price")
            .notEmpty()
            .isFloat({min: 0})
            .withMessage("Price must only be a positive number."),
            
            body("inv_miles")
            .notEmpty()
            .isInt({min: 0})
            .withMessage("Mileage must have a positive integer."),

            
            body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color is required."),

         

    ];
 }

/****************************************************
  * * Check Update Data  and Return errors ****8*****
  *******************************************/
inventoryValidate.checkEdittedData = async (req, res, next) => {
    let {inv_make, inv_model, inv_year, inv_description,inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body

    
     // Rebuild file paths from multer. this is a way so that they can be used in the form when the page is loading due to the post action
    // If you uploaded a file, construct file paths
    const formated_inv_image = req.savedImageName ? `/images/vehicles/${req.savedImageName}` : "";
    const formated_inv_thumbnail = req.savedThumbnailName ? `/images/vehicles/${req.savedThumbnailName}` : "";

    req.body.inv_image = formated_inv_image;
    req.body.inv_thumbnail = formated_inv_thumbnail;
    //manual checks because it would need to be formated in order to match.
    //if i write it in the rules, i will probably have to restate all this rules here as it would be lost after the inventoryCreationRules
    const imageRegex = /^\/images\/vehicles\/[\w\-]+\.(jpg|jpeg|png|webp)$/i;
    const thumbnailRegex = /^\/images\/vehicles\/[\w\-]+-tn\.(jpg|jpeg|png|webp)$/i;

    let errors = []
    if (!imageRegex.test(formated_inv_image)) {
        errors.push({msg: "Image file is required.\nImage path must follow the format: /images/vehicles/filename.jpg"});
    }
    if (!thumbnailRegex.test(formated_inv_thumbnail)) {
        errors.push({msg: "Thumbnail file is required.\nThumbnail must follow the format: /images/vehicles/filename-tn.jpg"})
    }

    
    // check for errors in the validate result
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationOptionList = await utilities.buildClassificationOptionList();
        res.render("inventory/edit-inventory", {
            errors: errors.array(), //flatten errors before sending to the view
            title: "Edit Inventory",
            nav,
            classificationOptionList, //this is the list of classifications to be used in the form when the page is loading due to the post action
            classification_id,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            formated_inv_image,
            formated_inv_thumbnail,// now its fetched and added to the body of the request.
            inv_price,
            inv_miles,
            inv_color,

        })
        return
    }
    next()// if no errors then continue to the next middleware.
}


/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */ 
inventoryValidate.addClassificationRules = ()=>{
    return [
        
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min:1})
            .withMessage("Please provide the classification name"),// on error this message is sent.

    ];
 }

 
 /****************************************************
  * * Check Classification Data  and Return errors ****8*****
  *******************************************/
inventoryValidate.checkClassificationData = async (req, res, next) => {
    let { classification_name} = req.body
    
    // check for errors in the validate result
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors: errors.array(), //flatten errors before sending to the view
            title: "Add Classification",
            nav,
            classification_name

        })
        return
    }
    next()// if no errors then continue to the next middleware.
}


 module.exports = inventoryValidate;