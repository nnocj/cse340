const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");

/* ***************************
 *  Build Login
 * ************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("accounts/login", {
    title: "Login",
    nav,
  })
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("accounts/register", {
    title: "Registration",
    nav,
  })
}

async function registerAccount(req, res) {
      let nav = await utilities.getNav();
      const { account_firstname, account_lastname, account_email, account_password} = req.body;
      const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, account_password);

      if (regResult) {
        req.flash("notice", `Congratulations! ${account_lastname}. You are registered. Please login`);
        res.status(201).render("accounts/login", {
          title: "Login",
          nav,
          error: null,
        })
      }
      else { // this ensure that there is always a chance to try again.
        req.flash("notice", `Sorry! ${account_lastname}. Registration failed. Please try again`);
        res.status(501).render("accounts/register", {
          title: "Registration",
          nav,
        })
      }
   
    }


module.exports = {buildLogin, buildRegister, registerAccount};