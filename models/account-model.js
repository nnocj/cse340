const pool= require("../database/index");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'client')  RETURNING *"; // first time reaching backend from the frontend view.
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    }
    catch (error) {
        return error.message;
    }
}

module.exports = {registerAccount};
