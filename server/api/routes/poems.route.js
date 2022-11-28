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
 * @apiHeader  {Cookie}         connect.sid         Users unique session cookie.
 * @apiQuery   {Number}         numPoems            The number of poems that should be returned.
 * @apiQuery   {Number}         offset              The offset from which the poems should be returned.
 * @apiQuery   {String}         orderBy             The order of the poems.
 * @apiQuery   {Object[String]} keywords            The keywords that should be searched.
 * @apiSuccess {Object[]}       poems               The list of poems.
 * @apiSuccess {Number}         poems.poemID        The id of the poem.
 * @apiSuccess {String}         poems.poemText      The text of the poem.
 * @apiSuccess {Date}           poems.timestamp     When this poem was posted.
 * @apiSuccess {Number}         poems.userID        The user id of the user that posted the poem.
 * @apiSuccess {String}         poems.username      The username of the user that posted the poem.
 * @apiSuccess {String}         poems.displayname   The displayname of the user that posted the poem.
 * @apiSuccess {Number}         poems.rating        The rating of the poem.
 * @apiSuccess {Number | null}  poems.rated         The rating that the user made on the poem.
 * @apiSuccess {boolean}        poems.isFavorite    Whether the user has marked this poem as favorite or not.
 * @apiSuccess {boolean}        poems.isFollowing   Whether the user is following the poet of this poem or not.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "poemID": 1,
 *     "poemText": "Ay, workman, make me a dream,\nA dream for my love.\nCunningly weave sunlight,\nBreezes, and flowers.\nLet it be of the cloth of meadows.\nAnd -- good workman --\nAnd let there be a man walking thereon.",
 *     "timestamp": "2022-08-06T10:58:56.000Z",
 *     "userID": 5,
 *     "username": "lara",
 *     "displayname": "Lara",
 *     "rating": "2",
 *     "rated": null,
 *     "isFavorite": 0,
 *     "isFollowing": 0
 *   },
 *   {
 *     "poemID": 2,
 *     "poemText": "Great cities seldom rest; if there be none\nT' invade from far, they'll find worse foes at home.",
 *     "timestamp": "2022-08-10T04:14:28.000Z",
 *     "userID": 4,
 *     "username": "maria",
 *     "displayname": "Maria",
 *     "rating": "0",
 *     "rated": null,
 *     "isFavorite": 0,
 *     "isFollowing": 0
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
 * @apiGroup Ratings
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

module.exports = authRouter;