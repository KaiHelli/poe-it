/*
 *  This file holds some methods that will often be required in the middleware to
 *  check whether users are authorized to access this API resource or not.
 */
'use strict';

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

