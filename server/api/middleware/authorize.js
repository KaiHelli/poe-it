/*
 *  This file holds some methods that will often be required in the middleware to
 *  check whether users are authorized to access this API resource or not.
 */
'use strict';
const sql = require('../middleware/database');

exports.isSignedIn = (req, res, next) => {
    if(req.session && req.session.userID) {
        next();
    } else {
        res.status(401).send({
            errors: ['Unauthorized, sign in to proceed.']
        });
    }
};

exports.notSignedIn = (req, res, next) => {
    if(req.session && req.session.userID) {
        res.status(403).send({
            errors: ['Forbidden, already signed in.']
        });
    } else {
        next();
    }
};

exports.hasRole = (roleID) => {
    return async (req, res, next) => {
            let rows = await sql.query('SELECT roleID FROM User WHERE userID = ?', req.session.userID);

            // If no match was found, return an error.
            if (rows.length !== 1) {
                res.status(500).send({errors: ['The roleID of the user could not be determined.']})
            // If the user does not have the required role, return an error.
            } else if (rows[0].roleID !== roleID) {
                res.status(403).send({errors: ['Your role does not have the required permissions.']})
            // Otherwise go to the next header.
            } else {
                next()
            }
        }
};

