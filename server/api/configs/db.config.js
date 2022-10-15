/*
 *  This file holds configuration parameters relevant to the database connection
 *  and MySQL session module configuration.
 */
'use strict';

const sqlConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    connectionLimit: 10,
    waitForConnections: true
}

const sessionStoreConfig = {
    clearExpired: true,              // Automatically deletes expired sessions from the database.
    checkExpirationInterval: 900000, // Expired sessions will be checked every 15 minutes.
    expiration: 86400000,            // Sessions expire after 24 hours.
    createDatabaseTable: false,      // We will use a custom database.
    endConnectionOnClose: false,     // The db connection will be shared with the application.
    charset: 'utf8mb4',
    schema: {                        // Defines the schema of the table we are using.
        tableName: 'Session',
        columnNames: {
            session_id: 'sessionID',
            expires: 'expires',
            data: 'sessionData'
        }
    }
}

exports.sqlConfig = sqlConfig;
exports.sessionStoreConfig = sessionStoreConfig;