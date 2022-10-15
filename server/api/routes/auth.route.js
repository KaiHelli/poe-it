/*
 * This file routes all available features that lie underneath the /api/auth/* URI.
 * It thereby uses middleware checks to verify if e.g. a user is authorized to access it.
 * It will then route the request to the method of the controller that handles it.
 */
'use strict';

const authRouter = require('express').Router();
const authController = require('../controller/auth.controller');
const authorize = require('../middleware/authorize')

authRouter.post('/signin', authorize.notSignedIn, authController.signin);

authRouter.post('/signup', authorize.notSignedIn, authController.signup);

authRouter.post('/signout', authorize.isSignedIn, authController.signout);

module.exports = authRouter;