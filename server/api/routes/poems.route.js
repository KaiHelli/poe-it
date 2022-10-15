/*
 * This file routes all available features that lie underneath the /v1/poems/* URI.
 * It thereby uses middleware checks to verify if e.g. a user is authorized to access it.
 * It will then route the request to the method of the controller that handles it.
 */
'use strict';

const authRouter = require('express').Router();
const poemsController = require('../controller/poems.controller');
const authorize = require('../middleware/authorize')

/**
 * @api {get} poems/private Get a list of private poems.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid         Users unique session cookie.
 * @apiSuccess {Object[]}   poems               The list of poems.
 * @apiSuccess {Number}     poems.poemID        The id of the poem.
 * @apiSuccess {String}     poems.poemText      The text of the poem.
 * @apiSuccess {Number}     poems.userID        The user id of the user that posted the poem.
 * @apiSuccess {Date}       poems.timestamp     When this poem was posted.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "poemID": 1,
 *     "poemText": "I wandered lonely as a cloud\nThat floats on high o’er vales and hills\nWhen all at once I saw a crowd\nA host, of golden daffodils",
 *     "userID": 2,
 *     "timestamp": "2022-10-03T17:25:36.000Z"
 *   },
 *   {
 *     "poemID": 2,
 *     "poemText": "Shall I compare thee to a summer’s day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer’s lease hath all too short a date;",
 *     "userID": 4,
 *     "timestamp": "2022-10-03T17:26:47.000Z"
 *   }
 * ]
 */
authRouter.get('/private', authorize.isSignedIn, poemsController.getUserPoems);

// TODO: Add additional features.
// authRouter.post('/private/', authorize.isSignedIn, poemsController.insertUserPoem);

/**
 * @api {get} poems/private/:id Get a specific private poem.
 * @apiParam {Number} id The id of the poem to be retrieved.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     Users unique session cookie.
 * @apiSuccess {Number}     poemID          The id of the poem.
 * @apiSuccess {String}     poemText        The text of the poem.
 * @apiSuccess {Number}     userID          The user id of the user that posted the poem.
 * @apiSuccess {Date}       timestamp       When this poem was posted.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "poemID": 1,
 *   "poemText": "I wandered lonely as a cloud\nThat floats on high o’er vales and hills\nWhen all at once I saw a crowd\nA host, of golden daffodils",
 *   "userID": 2,
 *   "timestamp": "2022-10-03T17:25:36.000Z"
 * }
 */
authRouter.get('/private/:id', authorize.isSignedIn, poemsController.getUserPoemByID);

// authRouter.delete('/private/:id', authorize.isSignedIn, poemsController.deleteUserPoemByID);

// authRouter.get('/public/', poemsController.getPublicPoems);

// authRouter.get('/public/:id', poemsController.getPublicPoemByID);

module.exports = authRouter;