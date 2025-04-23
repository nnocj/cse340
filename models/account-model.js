const pool= require("../database/index");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    let account_type = "Client";
    try {
        const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, $5)  RETURNING *"; // first time reaching backend from the frontend view.
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password, account_type]);
    }
    catch (error) {
        return error.message;
    }
}

async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1";
        const email = await pool.query(sql, [account_email]);//it's interesting the way it indexes to obtain the right data
        return email.rowCount;
    }
    catch (error) {
        return error.message;
    }
}

async function getAccountByEmail(account_email) {// here for week 5 i'm being more careful witht the data i send to the cleint
    try {
        const data = await pool.query(`SELECT * FROM account WHERE account_email = $1`,[account_email]);//it's interesting the way it indexes to obtain the right data
       
        return data.rows[0] || null;
    }
    catch (error) {
        return new Error("No matching email found");
    }
}

async function getAccountDetailsByAccountId(account_id) {
    try {
        const data = await pool.query(`SELECT * FROM public.account WHERE account_id = $1`, [account_id]);
        return data.rows;
    } catch (error) {
        console.error("getAccount error:", error);
        return []; // Return an empty array to avoid undefined
    }
}

/* *****************************
*   Edit Account info
* *************************** */
async function editAccountInfo(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id =$4 RETURNING *"; // fourth time reaching backend from the frontend view.
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    }
    catch (error) {
        return error.message;
    }
}


async function editUserAccountInfoByAdmin(account_id, account_firstname, account_lastname, account_email, account_type) {
    try {
        const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3, account_type = $4 WHERE account_id =$5 RETURNING *"; // fourth time reaching backend from the frontend view.
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_type, account_id]);
    }
    catch (error) {
        return error.message;
    }
}

async function deleteUserAccountByAdmin(account_id) {
    try {
        const sql = "DELETE FROM public.account WHERE account_id =$1 RETURNING *"; // 6th time reaching backend from the frontend view.
        return await pool.query(sql, [ account_id]);
    }
    catch (error) {
        return error.message;
    }
}


/* *****************************
*   Edit Account Password
* *************************** */
async function editAccountPassword(account_id, account_password) {

    try {
        const sql = "UPDATE public.account SET account_password = $1 WHERE account_id =$2 RETURNING *"; // fourth time reaching backend from the frontend view.
        return await pool.query(sql, [account_password, account_id]);
    }
    catch (error) {
        return error.message;
    }
}

/********************************************************
 * These Admin User Accounts Management functionalitis
 ********************************************************/

async function getAllUsersAccountInfo() {
    try {
      const allUsersAccountInfo = await pool.query(
        "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM public.account"
      );
      return allUsersAccountInfo.rows;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw new Error("Failed to retrieve account info");
    }
  }
  
module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountDetailsByAccountId, 
    getAllUsersAccountInfo, editAccountInfo, editAccountPassword, editUserAccountInfoByAdmin, deleteUserAccountByAdmin};
