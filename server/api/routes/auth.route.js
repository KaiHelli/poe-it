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
 * @apiSuccess {Cookie}     connect.sid         Users unique session cookie.
 * @apiSuccess {String}     message             Status that the login was successful.
 * @apiSuccess {Object}     user                The information corresponding to the current user.
 * @apiSuccess {Number}     user.id             The id of the user.
 * @apiSuccess {String}     user.username       The username of the user.
 * @apiSuccess {String}     user.displayname    The displayname of the user.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * Set-Cookie: connect.sid=s%3ArRnSKPxuWWTylVL5WxDZ46qcP-Nm6smT.4ec2DGasFmk6i80%2B04M7b03i%2FCuu%2B6KniO8W6l%2Fk8zw; Path=/; HttpOnly
 * {"message":"Login successful.","user":{"id":1,"username":"admin","displayname":"admin"}}
 * @apiError {String[]}     errors         List of errors that were found in this request.
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
 * @apiSuccess {Object}     user                The information corresponding to the current user.
 * @apiSuccess {Number}     user.id             The id of the user.
 * @apiSuccess {String}     user.username       The username of the user.
 * @apiSuccess {String}     user.displayname    The displayname of the user.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * Set-Cookie: connect.sid=s%3APcuQ2J5NPmZBc0ee2croDCzK1KsJW6T8.Xdph8MiOFptIhDjNUK0rabId53aCGvvbZsfJ0eqgKpQ; Path=/; HttpOnly
 * {"message":"User created successfully.","user":{"id":52,"username":"영길길","displayname":"영길길"}}
 * @apiError {String[]}     errors         List of errors that were found in this request.
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
 * @apiError {String[]}     errors         List of errors that were found in this request.
 */
authRouter.post('/signout', authorize.isSignedIn, authController.signout);

/**
 * @api {get} auth/signedin Get the current status, whether a user is currently signed in or not.
 * @apiGroup Authentication
 * @apiPermission unrestricted
 * @apiHeader {Cookie}      [connect.sid]    Users unique session cookie.
 * @apiSuccess {Bool}       signedIn         Whether the user is currently signed in or not.
 * @apiSuccess {Object}     user                The information corresponding to the current user.
 * @apiSuccess {Number}     user.id             The id of the user.
 * @apiSuccess {String}     user.username       The username of the user.
 * @apiSuccess {String}     user.displayname    The displayname of the user.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {"signedIn":true,"user":{"id":1,"username":"administrator","displayname":"Administrator"}}
 */
authRouter.get('/signedin', authController.signedin);

/**
 * @api {post} auth/changePassword Change the password of the current user.
 * @apiBody {String} curPassword The current password of the user.
 * @apiBody {String} newPassword The new password of the user.
 * @apiGroup Authentication
 * @apiPermission user
 * @apiHeader {Cookie}      connect.sid    Users unique session cookie.
 * @apiSuccess {String}     message        Status that the change was successful.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {"message":"Password changed successfully."}
 * @apiError {String[]}     errors         List of errors that were found in this request.
 */
authRouter.post('/changePassword', authorize.isSignedIn, authController.changePassword);

/**
 * @api {post} auth/changeUsername Change the username of the current user.
 * @apiBody {String} newUsername The new username of the user.
 * @apiGroup Authentication
 * @apiPermission user
 * @apiHeader {Cookie}      connect.sid         Users unique session cookie.
 * @apiSuccess {String}     message             Status that the change was successful.
 * @apiSuccess {Object}     user                The information corresponding to the current user.
 * @apiSuccess {Number}     user.id             The id of the user.
 * @apiSuccess {String}     user.username       The username of the user.
 * @apiSuccess {String}     user.displayname    The displayname of the user.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {"message":"Username changed successfully.","user":{"id":1,"username":"administrator","displayname":"Administrator"}}
 * @apiError {String[]}     errors         List of errors that were found in this request.
 */
authRouter.post('/changeUsername', authorize.isSignedIn, authController.changeUsername);

module.exports = authRouter;