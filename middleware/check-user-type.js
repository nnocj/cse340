const jwt = require("jsonwebtoken")
require("dotenv").config()

function checkEmployeeOrAdmin(req, res, next) {
    const user = res.locals.shareableAccountData;

    if (!user) {
        req.flash("notice", "You must be logged in to access this page.");
        return res.redirect("/account/login");
    }

    const allowedTypes = ["Employee", "Admin"];
    if (!allowedTypes.includes(user.account_type)) {
        req.flash("notice", "Access denied. Admin or Employee account required.");
        return res.redirect("/account/login");
    }

    next();
}

function checkUserIsAnAdmin(req, res, next) {
    const user = res.locals.shareableAccountData;

    if (!user) {
        req.flash("notice", "You must be logged in to access this page.");
        return res.redirect("/account/login");
    }

    const allowedTypes = ["Admin"];
    if (!allowedTypes.includes(user.account_type)) {
        req.flash("notice", "Access denied. Admin account required.");
        return res.redirect("/account/login");
    }

    next();
}


module.exports = {checkEmployeeOrAdmin, checkUserIsAnAdmin};