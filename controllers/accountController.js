const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    error: null,
  })
}

async function registerAccount(req, res) {

     
      let nav = await utilities.getNav();
      const { account_firstname, account_lastname, account_email, account_password} = req.body;
      const hashPassword = await bcrypt.hash(account_password, 10); // here is where I hash the password 
     
     
      const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashPassword);

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


async function accountLogin(req, res) {

     
      let nav = await utilities.getNav();
      const {account_email, account_password} = req.body;
      const accountData = await accountModel.getAccountByEmail(account_email);

      req.session.loggedin = true;
      req.session.firstname = accountData.account_firstname; // or whatever your client data is
      

      if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
        return
      }
      try {
          if (await bcrypt.compare(account_password, accountData.account_password)) {
            
            const {account_password, ...safeAccountData} = accountData;// this is to remove the pasword from the account data.;;
            const accessToken = jwt.sign(safeAccountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000});
            
            if (process.env.NODE_ENV === "development") {
              //from the cookies we can get the token and use it to access the protected routes.
              res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 });
            }
            else {
              res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600000 });
            }
            return res.redirect("/account"); //  this ensures that as long as you signed and the token is valid you are taken to the home page with everything set up or dash board.
      
          }
          else {
            req.flash("message notice", `Please check your credentials and try again`)
            res.status(400).render("accounts/login", {
              title: "Login",
              nav,
              errors: null,
              account_email,
            })
          }
    } catch (error) {
      console.error("Login error:", error.message);
      req.flash("notice", "Something went wrong. Please try again.")
      throw new Error("Access Forbidden!");
    }
}  

async function buildAccountManager(req, res) {
  let nav = await utilities.getNav();
  res.render("accounts/index", {
    title: "Account Management",
    nav,
    shareableAccountData : res.locals.shareableAccountData,
    error: null,
  })
}

module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManager}