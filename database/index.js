const {Pool} = require("pg");
require("dotenv").config();
/* ***************
 * Connection Pool to help with multiple requests or connections to the database.
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool
if (process.env.NODE_ENV == "development"){
    pool = new Pool ({
        connectionString: process.env.DATABASE_URL,
        ssl: {// ensures that the connection is secure from localhost to external database
            rejectUnauthorized: false,
        },
    })

    // Added for troubleshooting queries
    // during development
    module.exports = {
        async query(text, params){
            try {
                const res = await pool.query(text, params)
                console.log("executed query", {text})
                return res
            }
            catch (err){
                console.error("error in query", {text})
                throw err
            }
        },
    }
}

/*else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    module.exports = pool;
}*/

// I changes this else statement because I had run time issues.
else {
        pool = new Pool ({
            connectionString: process.env.DATABASE_URL,
        })
        module.exports = pool
}