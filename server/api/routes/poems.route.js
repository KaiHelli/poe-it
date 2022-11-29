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

/**
 * @api {get} poems/private_top Get a list of top 20 private poems by date.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid         Users unique session cookie.
 * @apiSuccess {Object[]}   poems               The list of poems.
 * @apiSuccess {Number}     poems.poemID        The id of the poem.
 * @apiSuccess {String}     poems.poemText      The text of the poem.
 * @apiSuccess {Number}     poems.userID        The user id of the user that posted the poem.
 * @apiSuccess {Date}       poems.timestamp     When this poem was posted.
 * @apiSuccess {Number}     poems.rating       Username of author
 * @apiSuccess {string}     poems.username    
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 * {"poemID":1,
 *  "poemText":"Ay, workman, make me a dream,\nA dream for my love.\nCunningly weave sunlight,\nBreezes, and flowers.\nLet it be of the cloth of meadows.\nAnd -- good workman --\nAnd let there be a man walking thereon.",
 *  "userID":5,
 *  "timestamp":"2022-08-06T10:58:56.000Z",
 *  "rating":"2",
 *  "username":"lara"},
 * ]
 */
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
 * @api {get} poems/ratings Dump all ratings.
 * @apiParam {Number} id The id of the poem to be retrieved.
 * @apiGroup Debug
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     Users unique session cookie.
 * @apiSuccess {Number}     poemID          The id of the poem.
 * @apiSuccess {String}     userID          The id of the user.
 * @apiSuccess {Number}     rating          The rating given by the user
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *      "poemID":1,
 *      "userID":20,
 *      "rating":1},
 *  {
 *      "poemID":1,
 *      "userID":43,
 *      "rating":1
 *  }
 * ]
 */

authRouter.get('/ratings', authorize.isSignedIn, poemsController.getRatingsDump);

/**
 * @api {get} view current user id
 * @apiDescription For confirming your backend/login works
 * @apiGroup Debug
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     Users unique session cookie.
 * @apiHeader  {Number}     UserId          Users id.
 * @apiSuccess {Number}     userID          The id of the user.
 * @apiSuccessExample {Number} Success-Response:
 * HTTP/1.1 200
 * 1
 */
 
authRouter.get('/getUserID', authorize.isSignedIn, poemsController.getUserID);



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

/**
 * @api {post} rate a specific poem with valid values being: -1, 0, 1
 * @apiParam {id} id: The id of the poem to be rated.
 * @apiGroup Ratings
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     Users unique session cookie.
 * @apiHeader  {Number}     UserId     Users id.
 * @apiSuccess {Number}     rating          The rating given by the user
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 
 * {Message : OK}
*/

authRouter.post('/vote/:id/:vote', authorize.isSignedIn, poemsController.postUpdateRatings)
// authRouter.get('/public/:id', poemsController.getPublicPoemByID);

module.exports = authRouter;