const  express = require('express');
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require('../utilities/index');
const regValidate = require("../utilities/account-validation") 
const checkJWTToken = require("../middleware/json-web-token");
const checkUserType = require("../middleware/check-user-type");


/***********************************
 ******  Secured Account Routes ***
            Week 5
 * *******************************/
/* Here i most times check tokens or unique identity or relations with the system,
then check obedience to rules, return disobedience for correction, then when corrected, 
 allowing access to functions Just like the celestial kingdom 😂*/
router.get("/authorizedEditAccount/:account_id", checkJWTToken.checkJWTToken, utilities.handleErrors(accountController.buildEditAccountPage));
router.post("/authorizedEditAccountPassword/:account_id", checkJWTToken.checkJWTToken, regValidate.accountPasswordRules(), utilities.handleErrors(accountController.editAccountPassword));
router.post("/authorizedEditAccountInfo/:account_id", checkJWTToken.checkJWTToken, regValidate.accountInfoRules(), utilities.handleErrors(accountController.editAccountInfo));

//This is in fulfilment of Week 6 assignment: I have added functionality for admins to manage other users
//The job of this API is simply to get data and supply it in JSON format
router.get("/api/getAllUserAccountsToAdmin",  utilities.handleErrors(accountController.getAllUserAccountsAPI));
router.post("/api/editUserAccountByAdmin/:account_id",  utilities.handleErrors(accountController.editUserAccountAPI));
router.delete("/api/deleteUserAccountByAdmin/:account_id",  utilities.handleErrors(accountController.deleteUserAccountAPI));
//While the sole purpose of this is to actually open the page which would use the API.
router.get('/manage-all-accounts', checkJWTToken.checkJWTToken, utilities.handleErrors(accountController.buildManageAllUsersPage))

//checkJWTToken.checkJWTToken, checkUserType.checkUserIsAnAdmin,




/***************************************
 *  Public or General Account Routes **
 * ***********************************/
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



module.exports = router;