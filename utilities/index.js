const invModel = require("../models/inventory-model")
const Util = {}; // this works as an object to store all the functions to create this file.
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next){
    let data = await invModel.getClassifications()
    //console.log(data.rows[0])
    let list = `<ul id="nav-div">`
    list += '<li class="nav-link"><a href="/" title="Homepage">Home</a></li>'
    
    if (data.rows && data.rows.length > 0) {
        data.rows.forEach((row) => {
            list += `<li class="nav-link"><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
        });
    }

    list += "</ul>"
    return list;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors"></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


  Util.buildInventoryItemView = async function(data){
    let grid
    grid = `<div id="item-display">      
                <img src="${data[0].inv_image}" alt="Image of ${data[0].inv_thumbnail} ${data[0].inv_model} on CSE Motors">
                <section id="item-details">
                  <h2>${data[0].inv_make} ${data[0].inv_model}  Details</h2>
                  <p class="details-color-var"><b>Price</b>: $${new Intl.NumberFormat('en-US').format(data[0].inv_price)}</p>
                  <p><b>Description</b>: ${data[0].inv_description}</p>
                  <p class="details-color-var"><b>Color</b>: ${data[0].inv_color}</p>
                  <p><b>Miles</b>: ${data[0].inv_miles}</p>
                </section>
              </div`
      return grid;
  }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res, next)).catch(next);
module.exports = Util;