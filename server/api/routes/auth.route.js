/*
 * This file routes all available features that lie underneath the /v1/auth/* URI.
 * It thereby uses middleware checks to verify if e.g. a user is authorized to access it.
 * It will then route the request to the method of the controller that handles it.
 */
'use strict';

const authRouter = require('express').Router();
const authController = require('../controller/auth.controller');
const authorize = require('../middleware/authorize')

/**
 * @api {post} auth/signin Sign in to the application.
 * @apiParam {String} username The username of the user.
 * @apiParam {String} password The password of the user.
 * @apiGroup Authentication
 */
authRouter.post('/signin', authorize.notSignedIn, authController.signin);

/**
 * @api {post} auth/signup Sign up for the application.
 * @apiParam {String} username The username to be used.
 * @apiParam {String} password The password to be used.
 * @apiGroup Authentication
 */
authRouter.post('/signup', authorize.notSignedIn, authController.signup);

/**
 * @api {post} auth/signout Sign out from the application.
 * @apiGroup Authentication
 */
authRouter.post('/signout', authorize.isSignedIn, authController.signout);

module.exports = authRouter;