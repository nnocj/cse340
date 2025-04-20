const  express = require('express');
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require('../utilities/index');
const regValidate = require("../utilities/account-validation") 

//process default account dashbord or index or default page
router.get('/', utilities.checkIfLoggedIn, utilities.handleErrors(accountController.buildAccountManager));
//process of building then login page
router.get('/login', utilities.handleErrors(accountController.buildLogin));
//process of loging into an account
router.post('/login', regValidate.accountLoginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
//process of building the register page
router.get('/register', utilities.handleErrors(accountController.buildRegister));
// process the registration request
router.post('/register', regValidate.registerationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
router.get("/logout", (req, res) => {req.session.destroy(() => { res.clearCookie("jwt"); res.redirect("/");});});



//process the login request
//router.post('/login', (req, res) => { 
    //res.status(200).send("login process");
//})

module.exports = router;