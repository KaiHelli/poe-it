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
authRouter.get('/private_top', authorize.isSignedIn, poemsController.getTopUserPoems);

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

/**
 * @api {get} poems/public Get one random public poem.
 * @apiGroup PublicPoems
 * @apiPermission unrestricted
 * @apiSuccess {Number}     poemID        The id of the poem.
 * @apiSuccess {String}     poemTitle     The title of the poem.
 * @apiSuccess {String}     poemText      The text of the poem.
 * @apiSuccess {String}     poetName      The author of the poem.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *   "poemID": 10444,
 *   "poemTitle": "Blank",
 *   "poemText": "When I came to my mother’s house the day after she had died it was already a museum of her unfinished gestures. The mysteries from the public library, duein two weeks. The half-eaten square of lasagna in the fridge.The half-burned wreckage of her last cigarette, and one red swallow of wine in a lipsticked glass beside her chair.Finally, a blue Bic on a couple of downs and acrosses left blank in the Sunday crossword, which actually had the audacity to look a little smug at having, for once, won.",
 *   "poetName": "George Bilgere"
 *   }
 */
authRouter.get('/public', poemsController.getPublicPoem);

// authRouter.get('/public/:id', poemsController.getPublicPoemByID);

/**
 * @api {post} Publish user poem
 * @apiParam {Number}       poemID      The ID of the poem.
 * @apiParam {String}       poemText    The text of the poem.
 * @apiParam {Number}       userID      The ID of the user who published.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200
 *   {Message : OK}
 */
 authRouter.post('/private/publish', poemsController.getPublicPoem);
 

module.exports = authRouter;