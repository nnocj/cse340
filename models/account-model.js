const pool= require("../database/index");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const data = await pool.query(`INSERT INTO public.account account_firstname, account_lastname, account_email, account_password`);
        return await pool(sql, [account_firstname, account_lastname, account_email, account_password]);
    }
    catch (error) {
        return error.message;
    }
}

module.exports = {registerAccount};
