const  express = require('express');
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require('../utilities/index');
const regValidate = require("../utilities/account-validation") 


router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));
// process the registration request
router.post('/register', regValidate.registerationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
//process the login request
router.post('/login', (req, res) => { 
    res.status(200).send("login process");
})

module.exports = router;