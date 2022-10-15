/*
 *  This file holds the methods that are used in the authentication context.
 *  They will then be called by the corresponding routes in the auth router.
 */
'use strict';

const argon2 = require('argon2');
const sql = require('../middleware/database');
const {body, validationResult} = require('express-validator');
const authConfig = require('../configs/auth.config');

/*
 * Handles the signup for the auth route.
 */
exports.signup =
    [
        // Validate the username attribute that was given in the request.
        body('username')
        .trim().isLength({min: 3, max: 20}).withMessage('Username should have 3 to 20 characters.')
        .custom(async username => {
            let rows = await sql.query('SELECT COUNT(username) AS num FROM User WHERE User.username = ?', username.toLowerCase());
            if (rows[0].num > 0) return Promise.reject('Username already in use.');
        }),
        // Validate the password attribute that was given in the request.
        body('password')
        .isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 0, minSymbols: 1})
        .withMessage('The password must have at least 8 character, 1 symbol, 1 uppercase and 1 lowercase character.')
        .custom(async (password, {req}) => {
            if (password.toLowerCase() === req.body.username.toLowerCase()) return Promise.reject('The password can\'t be your username.');
        }),
        // Handle the request itself.
        async (req, res) => {

        // If some validation failed, return the errors that occurred.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        // Normalize the username to lowercase.
        let username = req.body.username.toLowerCase();
        let password = req.body.password;

        // Generate the argon2 hash using a password specific salt and an application-wide pepper.
        let passwordHash = await argon2.hash(password, {type: argon2.argon2id, secret: authConfig.passwordPepper});

        // Insert the new user into the database. The roleID defaults to the 'General Poet' one.
        await sql.query('INSERT INTO User(username, password, roleID) VALUES (?, ?, 2)', [username, passwordHash]);

        // Get the userID of the created user.
        let rows = await sql.query('SELECT userID FROM User WHERE username = ?', username);

        // Create a session cookie for this user, insert the session to the database and return the cookie.
        req.session.userID = rows[0].userID;
        return res.status(201).json({message: 'User created successfully.'});
    }];

/*
 * Handles the signin for the auth route.
 */
exports.signin =
    [
        // Check whether the necessary fields are present.
        body('username').not().isEmpty().withMessage('Username is missing.'),
        body('password').not().isEmpty().withMessage('Password is missing.'),
        // Handle the request itself.
        async (req, res) => {
            // If some fields were not present, return the corresponding errors.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.array()});
            }

            // Normalize the username to lowercase.
            let username = req.body.username.toLowerCase();
            let password = req.body.password;

            // Get the userID and password corresponding to this username.
            let rows = await sql.query('SELECT userID, password FROM User WHERE username = ?', username);

            // If no match was found, return an error.
            if (rows.length !== 1) {
                return res.status(403).send({error: 'Username/password combination was not found.'})
            }

            // Assign the results to variables.
            let userID = rows[0].userID;
            let dbPassword = rows[0].password;

            // Verify with argon2, whether the password evaluates to the same hash stored in the database.
            const match = await argon2.verify(dbPassword, password, {secret: authConfig.passwordPepper});

            // If the password does not match, return an error.
            if (!match) {
                return res.status(403).send({error: 'Username/password combination was not found.'})
            }

            // Create a session cookie for this user, insert the session to the database and return the cookie.
            req.session.userID = userID;
            return res.status(200).send({message: 'Login successful.'})
    }];

/*
 * Handles the signout for the auth route.
 */
exports.signout =
    async (req, res) => {
        // Destroy the active session of this user. This deletes the entry in the database and also destroys the cookie.
        req.session.destroy(err => {
            if(err) {
                return res.status(500).send({message: 'Logout failed.'})
            }
            return res.status(200).send({message: 'Logout successful.'})
        });
    };