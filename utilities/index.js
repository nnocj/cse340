const invModel = require("../models/inventory-model")


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
async function getNav(req, res, next) {
  let data = await invModel.getClassifications()
  let list = `<ul id="nav-div">`
  list += '<li class="nav-link"><a href="/" title="Homepage">Home</a></li>'

  if (data.rows && data.rows.length > 0) {
    data.rows.forEach((row) => {
      list += `<li class="nav-link"><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`
    })
  }

  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification view HTML
 ************************************** */
async function buildClassificationGrid(data) {
  let grid = ''

  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`
      grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors"></a>`
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += `<h2><a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a></h2>`
      grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}

/* **************************************
 * Build the classification view HTML
 ************************************** */
async function buildClassificationOptionList(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Build the inventory item view HTML
 **************************************** */
async function buildInventoryItemView(data) {
  return `
    <div id="item-display">      
      <img src="${data[0].inv_image}" alt="${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}">
      <section id="item-details">
        <h2>${data[0].inv_make} ${data[0].inv_model} Details</h2>
        <p class="details-color-var"><b>Price</b>: $${new Intl.NumberFormat('en-US').format(data[0].inv_price)}</p>
        <p><b>Description</b>: ${data[0].inv_description}</p>
        <p class="details-color-var"><b>Color</b>: ${data[0].inv_color}</p>
        <p><b>Miles</b>: ${data[0].inv_miles}</p>
      </section>
    </div>
  `
}

/* ****************************************
 *  Check Login
 * ************************************ */
async function checkIfLoggedIn(req, res, next) {
  if (res.locals.loggedin) {
    next()
  }
  else {
    req.flash("notice", "Please log in")
    res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
function handleErrors(fn) {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
}


module.exports = {
  getNav,
  buildClassificationGrid,
  buildInventoryItemView,
  handleErrors,
  buildClassificationOptionList,
  checkIfLoggedIn,
}
