/*
 *  This file holds configuration parameters relevant to the authentication.
 */
'use strict';

const authConfig = {
    passwordPepper: Buffer.from(process.env.PASSWORD_PEPPER, 'hex'),
    sessionSecret: process.env.SESSION_SECRET
}

module.exports = authConfig;