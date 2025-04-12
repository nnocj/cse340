const pool = require("../database/index.js");
/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    const data =  await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
    return data;
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

async function getSingleItem() {
    try {
        const data =  await pool.query("SELECT * FROM public.inventory WHERE inv_id");
        return data;
    }

    catch (error) {
        console.error("getSingleItem error" + error)
    }

}

module.exports = {getSingleItem};

module.exports = {getClassifications, getInventoryByClassificationId};