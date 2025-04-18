const pool = require("../database/index");
/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    const data =  await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
    return data;
}

/* ***************************
 *  Get classification data by classification name
 * ************************** */
async function getClassificationByName(classification_name) {
    try{
        const data =  await pool.query(`SELECT classification_name FROM classification WHERE classification_name = $1`, [classification_name]);
        return data.rows[0] || null;
    }catch (error) {
        return error.message;
    }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id  
 * ************************** */
async function getInventoryByClassificationId(classification_id){
    try {
            const data = await pool.query(`SELECT * FROM public.inventory 
                AS i JOin public.classification
                AS c ON i.classification_id = c.classification_id
                WHERE i.Classification_id = $1`, [classification_id])

                return data.rows;
    }
    catch (error) {
        console.error("getClassificationByID error" + error)
    }
}

async function getInventoryDetailsByInventoryId(inv_id) {
    try {
        const data = await pool.query(`SELECT * FROM public.inventory 
            WHERE inv_id = $1`, [inv_id])

            return data.rows;
    }

    catch (error) {
        console.error("getInventoryItem error" + error)
    }

}


/* *****************************
*   Add new inventory item
* *************************** */
async function addInventory(inv_make, inv_model,inv_year,inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,inv_color, classification_id) {
    try {
        const sql = "INSERT INTO inventory (inv_make, inv_model,inv_year,inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  RETURNING *"; // Second time reaching backend from the frontend view.
        return await pool.query(sql, [inv_make, inv_model,inv_year,inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,inv_color, classification_id]);
    }
    catch (error) {
        return error.message;
    }
}

/* *****************************
*   Add new Classification item
* *************************** */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1)  RETURNING *"; // third time I'm reaching backend from the frontend view.
        return await pool.query(sql, [classification_name]);
    }
    catch (error) {
        return error.message;
    }
}
module.exports = {getClassifications,getClassificationByName, getInventoryDetailsByInventoryId, getInventoryByClassificationId, addInventory, addClassification};