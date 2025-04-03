const invModel = require("../models/inventory-model")
const Util = {}; // this works as an object to store all the functions to create this file.
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next){
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Homepage">Home</a></li>'
    data.rows.foreach((row) =>{
        if (data.rows && data.rows.length > 0) {
            data.rows.forEach((row) => {
                list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
            });
        }
        
    })

    list += "</ul>"
    return list;
}

module.exports = Util;