const jwt = require("jsonwebtoken")
require("dotenv").config()

async function checkJWTToken(req,res, next){
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, shareableAccountData) => {
            if (err) {
                req.flash("notice", "Please log in to access this page.")
                res.clearCookie("jwt")
                return res.redirect("/account/login")
            }
            res.locals.shareableAccountData = shareableAccountData;
            res.locals.loggedin = 1;
            next();
        })
    }
    else {
        res.locals.shareableAccountData = null;
        res.locals.loggedin = 0;
        next();
    }
}


module.exports = {checkJWTToken}