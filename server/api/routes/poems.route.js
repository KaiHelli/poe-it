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
 * @apiHeader  {Cookie}             connect.sid         Users unique session cookie.
 * @apiQuery   {Number}             numPoems            The number of poems that should be returned.
 * @apiQuery   {Number}             offset              The offset from which the poems should be returned.
 * @apiQuery   {String}             orderBy             The order of the poems.
 * @apiQuery   {Object[String]}     keywords            The keywords that should be searched.
 * @apiQuery   {boolean}            filterFavorite      Whether only poems that are favorized should be returned or not.
 * @apiQuery   {boolean}            filterPersonal      Whether only poems that are your own should be returned or not.
 * @apiQuery   {boolean}            filterFollowing     Whether only poems by followed poets should be returned or not.
 * @apiSuccess {Object[]}           poems               The list of poems.
 * @apiSuccess {Number}             poems.poemID        The id of the poem.
 * @apiSuccess {String}             poems.poemText      The text of the poem.
 * @apiSuccess {Date}               poems.timestamp     When this poem was posted.
 * @apiSuccess {Number}             poems.userID        The user id of the user that posted the poem.
 * @apiSuccess {String}             poems.username      The username of the user that posted the poem.
 * @apiSuccess {String}             poems.displayname   The displayname of the user that posted the poem.
 * @apiSuccess {Number}             poems.rating        The rating of the poem.
 * @apiSuccess {Number}             poems.rated         The rating that the user made on the poem.
 * @apiSuccess {boolean}            poems.isFavorite    Whether the user has marked this poem as favorite or not.
 * @apiSuccess {boolean}            poems.isFollowing   Whether the user is following the poet of this poem or not.
 * @apiSuccess {boolean}            poems.isReported    Whether the user has reported this poem or not.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "poemID": 120,
 *     "poemText": "Follow to the deep wood's weeds,\nFollow to the wild-briar dingle,\nWhere we seek to intermingle,\nAnd the violet tells her tale\nTo the odour-scented gale,\nFor they two have enough to do\nOf such work as I and you.",
 *     "timestamp": "2022-10-15T06:56:39.000Z",
 *     "userID": 39,
 *     "username": "maire",
 *     "displayname": "Maire",
 *     "rating": "2",
 *     "rated": null,
 *     "isFavorite": 0,
 *     "isFollowing": 0,
 *     "isReported": 0
 *   },
 *   {
 *     "poemID": 119,
 *     "poemText": "ÆGLE, beauty and poet, has two little crimes;\nShe makes her own face, and does not make her rhymes.",
 *     "timestamp": "2022-10-14T19:55:13.000Z",
 *     "userID": 16,
 *     "username": "афанасий",
 *     "displayname": "Афанасий",
 *     "rating": "0",
 *     "rated": null,
 *     "isFavorite": 0,
 *     "isFollowing": 0,
 *     "isReported": 0
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
 * @apiHeader  {Cookie}             connect.sid     Users unique session cookie.
 * @apiSuccess {Object[]}           poems               The list of poems.
 * @apiSuccess {Number}             poems.poemID        The id of the poem.
 * @apiSuccess {String}             poems.poemText      The text of the poem.
 * @apiSuccess {Date}               poems.timestamp     When this poem was posted.
 * @apiSuccess {Number}             poems.userID        The user id of the user that posted the poem.
 * @apiSuccess {String}             poems.username      The username of the user that posted the poem.
 * @apiSuccess {String}             poems.displayname   The displayname of the user that posted the poem.
 * @apiSuccess {Number}             poems.rating        The rating of the poem.
 * @apiSuccess {Number}             poems.rated         The rating that the user made on the poem.
 * @apiSuccess {boolean}            poems.isFavorite    Whether the user has marked this poem as favorite or not.
 * @apiSuccess {boolean}            poems.isFollowing   Whether the user is following the poet of this poem or not.
 * @apiSuccess {boolean}            poems.isReported    Whether the user has reported this poem or not.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "poemID": 2,
 *   "poemText": "Great cities seldom rest; if there be none\nT' invade from far, they'll find worse foes at home.",
 *   "timestamp": "2022-08-10T04:14:28.000Z",
 *   "userID": 4,
 *   "username": "maria",
 *   "displayname": "Maria",
 *   "rating": "0",
 *   "rated": null,
 *   "isFavorite": 0,
 *   "isFollowing": 0,
 *   "isReported": 0
 * }
 */
authRouter.get('/private/:id', authorize.isSignedIn, poemsController.getUserPoemByID);

/**
 * @api {put} /private/:id Update a poem
 * @apiDescription Update a poem by id
 * @apiParam {Number} id The id of the poem to be updated.
 * @apiBody {String} poemText The text that the poem should be updated to.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid         User's unique session cookie.
 * @apiSuccess {String}     message             Status that the operation was successful.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200
 * {message: Poem updated successfully.}
 */
authRouter.put('/private/:id', authorize.isSignedIn, poemsController.updateUserPoemByID)

/**
 * @api {delete} /private/:id Delete a poem
 * @apiDescription Delete a poem by id
 * @apiParam {Number} id The id of the poem to be deleted.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid         User's unique session cookie.
 * @apiSuccess {String}     message             Status that the deletion was successful.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200
 * {message: Poem deleted successfully.}
 */
authRouter.delete('/private/:id', authorize.isSignedIn, poemsController.deleteUserPoemByID)

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
 * @api {post} poems/private/:id/rate/:rating rate a specific poem
 * @apiParam {Number}       id              The id of the poem to be rated.
 * @apiParam {Number}       value           The rating of the vote. Valid values being: -1, 1
 * @apiGroup Ratings
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     User's unique session cookie.
 * @apiHeader  {Number}     userId          User's id.
 * @apiSuccess {String}     message         Status that the rating was successful.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 
 * {message : Rating was successful.}
*/
authRouter.post('/private/:id/rate/:rating', authorize.isSignedIn, poemsController.postUpdateRatings)

/**
 * @api {get} poems/ratings Dump all ratings.
 * @apiGroup Debug
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     Users unique session cookie.
 * @apiSuccess {Number}     poemID          The id of the poem.
 * @apiSuccess {Number}     userID          The id of the user.
 * @apiSuccess {Number}     rating          The rating given by the user
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "0": {
 *       "poemID": 9,
 *       "poemText": "A full fed Rose on meals of Tint\nA Dinner for a Bee\nIn process of the Noon became -\nEach bright Mortality\nThe Forfeit is of Creature fair\nItself, adored before\nSubmitting for our unknown sake\nTo be esteemed no more --",
 *       "userID": 5,
 *       "timestamp": "2022-08-25T03:07:21.000Z"
 *   }
 * }
 */
authRouter.get('/ratings', authorize.isSignedIn, poemsController.getRatingsDump);



/**
 * @api {get} poems/follows Dump all follows.
 * @apiGroup Debug
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     Users unique session cookie.
 * @apiSuccess {Number}     userID          The user following the other.
 * @apiSuccess {Number}     followedUserID  The id of the user.
 */
authRouter.get('/follows', authorize.isSignedIn, poemsController.getFollowsDump);

/**
 * @api {get} poems/favorites Dump all favorites.
 * @apiGroup Debug
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     Users unique session cookie.
 * @apiSuccess {Number}     poemID          The id of the poem.
 * @apiSuccess {Number}     userID  The id of the user.
 */
authRouter.get('/favorites', authorize.isSignedIn, poemsController.getFavoritesDump);

/**
 * @api {post} poems/private/publish/:userID/:poemText Publish user poem
 * @apiParam {Number}        userID      The ID of the user who published.
 * @apiParam {String}       poemText    The text of the poem.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200
 *   {Message : OK}
 */
 authRouter.post('/private/publish/:userID/:poemText', authorize.isSignedIn, poemsController.getPublicPoem);

module.exports = authRouter;