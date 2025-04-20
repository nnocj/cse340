const utilities = require("../utilities/index");
// body is to access data while validateResult contains errors detected by validation
const {body, validationResult} = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
 validate.registerationRules = ()=> {
    return [
        //firstname is required and must be a string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide your first name"), // on error this message is sent.

        //firstname is required and must be a string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 2})
            .withMessage("Please provide your last name"), // on error this message is sent.    
    
        //firstname is required and must be a string
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new error("Email already in use. Please use another email address.");
                } 
            })
            .withMessage("A valid email address is required."), // on error this message is sent.

        //firstname is required and must be a string
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase:1,
                minNumbers:1,
                minSymbols: 1,
            })
            
            .withMessage("Password does not meet requirements"), // on error this message is sent.
        ]
 }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => { // checking regualr data
    const {account_firstname, account_lastname, account_email} = req.body;
    let errors = []
    errors = validationResult(req);// checking for errors
    if (!errors.isEmpty()){
        let nav = await utilities.getNav();
        res.render("accounts/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return 
    }
    next()// if no errrors, continue to the next middleware
}

/*  **********************************
  *  Account Login Data Validation Rules
  * ********************************* */
validate.accountLoginRules = ()=> {
    return [
        
        //firstname is required and must be a string
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists) {
                    throw new error("There is no account registered with this email address.\nPlease register for an account.");
                } 
            })
            .withMessage("A valid email address is required."), // on error this message is sent.

        //firstname is required and must be a string
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase:1,
                minNumbers:1,
                minSymbols: 1,
            })
            
            .withMessage("Password does not meet requirements"), // on error this message is sent.
        ]
 }

 /* ******************************
 * Check Account Login data and return errors or redirect to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => { // checking regualr data
    const { account_email} = req.body;
    let errors = []
    errors = validationResult(req);// checking for errors
    if (!errors.isEmpty()){
        let nav = await utilities.getNav();
        res.render("accounts/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return 
    }
    next()// if no errrors, continue to the next middleware
}

module.exports = validate;
