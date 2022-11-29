/*
 *  This file holds the methods that are used in the authentication context.
 *  They will then be called by the corresponding routes in the auth router.
 */
'use strict';

const argon2 = require('argon2');
const sql = require('../middleware/database');
const {body, validationResult} = require('express-validator');
const authConfig = require('../configs/auth.config');
const rolesConfig = require('../configs/roles.config')

const msgOnlyValidationResult = validationResult.withDefaults({
    formatter: error => {
        return error.msg;
    }
});

/*
 * Handles the signup for the auth route.
 */
exports.signup =
    [
        // Validate the username attribute that was given in the request.
        body('username')
        .trim().isLength({min: 1, max: 20}).withMessage('Username should have 1 to 20 characters.')
        .custom(async username => {
            let rows = await sql.query('SELECT COUNT(username) AS num FROM User WHERE User.username = ?', username.normalize().toLowerCase());
            if (rows[0].num > 0) return Promise.reject('Username already in use.');
        }),
        // Validate the password attribute that was given in the request.
        body('password')
        .isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 0, minSymbols: 1})
        .withMessage('The password must have at least 8 character, 1 symbol, 1 uppercase and 1 lowercase character.'),
        // Handle the request itself.
        async (req, res) => {

        // If some validation failed, return the errors that occurred.
        const errors = msgOnlyValidationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        // Normalize the username to lowercase and normalize the unicode characters.
        let displayname = req.body.username.trim().normalize();
        let username = displayname.toLowerCase();
        let password = req.body.password.normalize();

        // Generate the argon2 hash using a password specific salt and an application-wide pepper.
        let passwordHash = await argon2.hash(password, {type: argon2.argon2id, secret: authConfig.passwordPepper});

        // Insert the new user into the database. The roleID defaults to the 'General Poet' one.
        await sql.query('INSERT INTO User(username, displayname, password, roleID) VALUES (?, ?, ?, ?)', [username, displayname, passwordHash, rolesConfig.generalPoet]);

        // Get the userID and role of the created user.
        let rows = await sql.query('SELECT userID, roleID, roleName FROM User NATURAL JOIN Role WHERE username = ?', username);

        // Assign the results to variables.
        let userID = rows[0].userID;
        let roleID = rows[0].roleID;
        let roleName = rows[0].roleName;

        // Create a session cookie for this user, insert the session to the database and return the cookie.
        req.session.userID = userID;
        return res.status(201).json({message: 'User created successfully.', user: {userID: userID, username: username, displayname: displayname, role: {roleID: roleID, roleName: roleName}}});
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
            const errors = msgOnlyValidationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.array()});
            }

            // Normalize the username to lowercase.
            let username = req.body.username.normalize().toLowerCase();
            let password = req.body.password.normalize();

            // Get the userID, password and role corresponding to this username.
            let rows = await sql.query('SELECT userID, displayname, password, roleID, roleName FROM User NATURAL JOIN Role WHERE username = ?', username);

            // If no match was found, return an error.
            if (rows.length !== 1) {
                return res.status(403).send({errors: ['Username/password combination was not found.']})
            }

            // Assign the results to variables.
            let userID = rows[0].userID;
            let displayname = rows[0].displayname;
            let dbPassword = rows[0].password;
            let roleID = rows[0].roleID;
            let roleName = rows[0].roleName;

            // Verify with argon2, whether the password evaluates to the same hash stored in the database.
            const match = await argon2.verify(dbPassword, password, {secret: authConfig.passwordPepper});

            // If the password does not match, return an error.
            if (!match) {
                return res.status(403).send({errors: ['Username/password combination was not found.']})
            }

            // Create a session cookie for this user, insert the session to the database and return the cookie.
            req.session.userID = userID;
            return res.status(200).send({message: 'Login successful.', user: {userID: userID, username: username, displayname: displayname, role: {roleID: roleID, roleName: roleName}}})
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

/*
 * Handles the check whether a user is signed in or not for the auth route.
 */
exports.signedin =
    async (req, res) => {
        if(req.session && req.session.userID) {
            // Get the username and role corresponding to this userID.
            let rows = await sql.query('SELECT username, displayname, roleID, roleName FROM User NATURAL JOIN Role WHERE userID = ?', req.session.userID);

            // If no match was found, return an error.
            if (rows.length !== 1) {
                return res.status(200).send({signedIn: false})
            }

            return res.status(200).send({signedIn: true , user: {userID: req.session.userID, username: rows[0].username, displayname: rows[0].displayname, role: {roleID: rows[0].roleID, roleName: rows[0].roleName}}})
        } else {
            return res.status(200).send({signedIn: false})
        }
    };

/*
 * Handles the change password route.
 */

exports.changePassword =
    [
        body('curPassword').not().isEmpty().withMessage('Current password is missing.'),
        // Validate the new password attribute that was given in the request.
        body('newPassword')
            .isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 0, minSymbols: 1})
            .withMessage('The new password must have at least 8 character, 1 symbol, 1 uppercase and 1 lowercase character.'),
        // Handle the request itself.
        async (req, res) => {
            // If some validation failed, return the errors that occurred.
            const errors = msgOnlyValidationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.array()});
            }

            // Normalize the unicode characters.
            let curPassword = req.body.curPassword.normalize();
            let newPassword = req.body.newPassword.normalize();

            // Get the password corresponding to this userID.
            let rows = await sql.query('SELECT password FROM User WHERE userID = ?', req.session.userID);

            // If no match was found, return an error.
            if (rows.length !== 1) {
                return res.status(403).send({errors: ['UserID/password combination was not found']})
            }

            // Assign the results to variables.
            let dbPassword = rows[0].password;

            // Verify with argon2, whether the password evaluates to the same hash stored in the database.
            const match = await argon2.verify(dbPassword, curPassword, {secret: authConfig.passwordPepper});

            // If the password does not match, return an error.
            if (!match) {
                return res.status(403).send({errors: ['UserID/password combination was not found.']})
            }

            // Generate the argon2 hash using a password specific salt and an application-wide pepper.
            let passwordHash = await argon2.hash(newPassword, {type: argon2.argon2id, secret: authConfig.passwordPepper});

            // Update the password in the database.
            await sql.query('UPDATE User SET password = ? WHERE userID = ?', [passwordHash, req.session.userID]);

            return res.status(201).json({message: 'Password changed successfully.'});
        }];

/*
 * Handles the change username route.
 */

exports.changeUsername =
    [
        // Validate the new username attribute that was given in the request.
        body('newUsername').trim().isLength({min: 1, max: 20}).withMessage('Username should have 1 to 20 characters.')
        .custom(async username => {
            let rows = await sql.query('SELECT COUNT(username) AS num FROM User WHERE User.username = ?', username.normalize().toLowerCase());
            if (rows[0].num > 0) return Promise.reject('Username already in use.');
        }),
        // Handle the request itself.
        async (req, res) => {
            // If some validation failed, return the errors that occurred.
            const errors = msgOnlyValidationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.array()});
            }

            // Normalize the unicode characters.
            let newDisplayname = req.body.newUsername.trim().normalize();
            let newUsername = newDisplayname.toLowerCase();

            // Update the username in the database.
            await sql.query('UPDATE User SET username = ?, displayname = ? WHERE userID = ?', [newUsername, newDisplayname, req.session.userID]);

            return res.status(200).json({message: 'Username changed successfully.', user: {userID: req.session.userID, username: newUsername, displayname: newDisplayname}});
        }];