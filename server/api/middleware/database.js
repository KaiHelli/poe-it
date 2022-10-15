/*
 * This file holds and sets up the central interface to the MySQL database.
 */
'use strict';

// Set up the MySQL pool using the stored config.
const sql = require('mysql2/promise');
const {sqlConfig, sessionStoreConfig} = require('../configs/db.config');
const pool = sql.createPool(sqlConfig);

// Set up the MySQL session store using the pool created above.
const session = require('express-session')
const mySQLStore = require('express-mysql-session')(session)
const sessionStore = new mySQLStore(sessionStoreConfig, pool);

// Export a query function that hides the resulting fields.
// Could be extended to handle database errors or connection issues centrally as well.
exports.query = async function query(statement, parameters) {
    const [rows, fields] = await pool.query(statement, parameters);
    return rows;
}

exports.pool = pool;
exports.session = session;
exports.sessionStore = sessionStore;