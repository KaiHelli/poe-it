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
 * @apiBody {String} username The username of the user.
 * @apiBody {String} password The password of the user.
 * @apiGroup Authentication
 * @apiPermission anonymous
 * @apiSuccess {Cookie}     connect.sid    Users unique session cookie.
 * @apiSuccess {String}     message        Status that the login was successful.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * Set-Cookie: connect.sid=s%3ArRnSKPxuWWTylVL5WxDZ46qcP-Nm6smT.4ec2DGasFmk6i80%2B04M7b03i%2FCuu%2B6KniO8W6l%2Fk8zw; Path=/; HttpOnly
 * {"message": "Login successful."}
 */
authRouter.post('/signin', authorize.notSignedIn, authController.signin);

/**
 * @api {post} auth/signup Sign up for the application.
 * @apiBody {String} username The username to be used.
 * @apiBody {String} password The password to be used.
 * @apiGroup Authentication
 * @apiPermission anonymous
 * @apiSuccess (Success 201) {Cookie}     connect.sid    Users unique session cookie.
 * @apiSuccess (Success 201) {String}     message        Status that the signup was successful.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * Set-Cookie: connect.sid=s%3APcuQ2J5NPmZBc0ee2croDCzK1KsJW6T8.Xdph8MiOFptIhDjNUK0rabId53aCGvvbZsfJ0eqgKpQ; Path=/; HttpOnly
 * {"message":"User created successfully."}
 */
authRouter.post('/signup', authorize.notSignedIn, authController.signup);

/**
 * @api {post} auth/signout Sign out from the application.
 * @apiGroup Authentication
 * @apiPermission user
 * @apiHeader {Cookie}      connect.sid    Users unique session cookie.
 * @apiSuccess {String}     message        Status that the logout was successful.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {"message": "Logout successful."}
 */
authRouter.post('/signout', authorize.isSignedIn, authController.signout);

/**
 * @api {get} auth/signedin Get the current status, whether a user is currently signed in or not.
 * @apiGroup Authentication
 * @apiPermission unrestricted
 * @apiHeader {Cookie}      [connect.sid]    Users unique session cookie.
 * @apiSuccess {Bool}       message          Whether the user is currently signed in or not.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {"message": True}
 */
authRouter.get('/signedin', authController.signedin);

module.exports = authRouter;