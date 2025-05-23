const utilities = require("../utilities/index")
const baseController = {}

baseController.buildHome = async function(req, res){ // this is a way of creating fuunctions of objects without writing them in the class of the object.
    const nav = await utilities.getNav()
    req.flash("notice", "   This is a flash message.");
    res.render("index", {title: "Home", nav});
}

module.exports = baseController;