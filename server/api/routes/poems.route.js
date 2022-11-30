/*
 * This file routes all available features that lie underneath the /v1/poems/* URI.
 * It thereby uses middleware checks to verify if e.g. a user is authorized to access it.
 * It will then route the request to the method of the controller that handles it.
 */
'use strict';

const poemsRouter = require('express').Router();
const poemsController = require('../controller/poems.controller');
const authorize = require('../middleware/authorize')
const rolesConfig = require("../configs/roles.config");

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
 *     "poemID": 124,
 *     "poemText": "His face was like a snake's--wrinkled and loose\nAnd withered--",
 *     "timestamp": "2022-10-16T08:06:20.000Z",
 *     "userID": 31,
 *     "username": "ida",
 *     "displayname": "Ida",
 *     "rating": 18446744073709552000,
 *     "rated": null,
 *     "isFavorite": 0,
 *     "isFollowing": 0,
 *     "isReported": 0
 *   },
 *   {
 *     "poemID": 123,
 *     "poemText": "No, Music, thou art not the 'food of Love.'\nUnless Love feeds upon its own sweet self,\nTill it becomes all Music murmurs of.",
 *     "timestamp": "2022-10-16T01:56:25.000Z",
 *     "userID": 12,
 *     "username": "micheletto",
 *     "displayname": "Micheletto",
 *     "rating": 1,
 *     "rated": null,
 *     "isFavorite": 0,
 *     "isFollowing": 0,
 *     "isReported": 0
 *   }
 * ]
 */
poemsRouter.get('/private', authorize.isSignedIn, poemsController.getUserPoems);

// TODO: Add additional features.
// poemsRouter.post('/private/', authorize.isSignedIn, poemsController.insertUserPoem);

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
 *   "rating": 0,
 *   "rated": null,
 *   "isFavorite": 0,
 *   "isFollowing": 0,
 *   "isReported": 0
 * }
 */
poemsRouter.get('/private/:id', authorize.isSignedIn, poemsController.getUserPoemByID);


/**
 * @api {get} /poems/public/tags/:id Get String of Tags of Poem
 * @apiDescription Get String of Tags of Public Poem
 * @apiParam {Number} id The id of the poem 
 * @apiGroup PublicPoems
 * @apiSuccess {String}     tags   string containg all tags seperated by commas
 * @apiSuccessExample {String} Success-Response:
 * HTTP/1.1 200
 * {"tags":"Family & Ancestors, History & Politics, Landscapes & Pastorals"}
 */
poemsRouter.get('/public/tags/:id', poemsController.getPublicPoemTags);




/**
 * @api {post} /private Publish a poem
 * @apiDescription Publish a poem
 * @apiBody {String} poemText The text of the poem.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid         User's unique session cookie.
 * @apiSuccess {String}     message             Status that the operation was successful.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200
 * {"message": "Poem published successfully."}
 */
poemsRouter.post('/private/', authorize.isSignedIn, poemsController.postUserPoem);

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
 * {"message": "Poem updated successfully."}
 */
poemsRouter.put('/private/:id', authorize.isSignedIn, poemsController.updateUserPoemByID)

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
 * {"message": "Poem deleted successfully."}
 */
poemsRouter.delete('/private/:id', authorize.isSignedIn, poemsController.deleteUserPoemByID)

/**
 * @api {post} poems/private/:id/rate/:rating rate a specific poem
 * @apiParam {Number}       id              The id of the poem to be rated.
 * @apiParam {Number}       rating          The rating of the vote. Valid values being: -1, 1
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     User's unique session cookie.
 * @apiSuccess {String}     message         Status that the rating was successful.
 * @apiSuccess {Boolean}    deleted         Whether the poem was deleted due to reaching the threshold or not.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200
 * {"message" : "Rating was successful.", "deleted" : true}
 */
poemsRouter.post('/private/:id/rate/:rating', authorize.isSignedIn, poemsController.rateUserPoemByID)

/**
 * @api {get} poems/reports         Get reports along with the corresponding poems.
 * @apiGroup PrivatePoems
 * @apiPermission admin
 * @apiHeader  {Cookie}             connect.sid                 Users unique session cookie.
 * @apiQuery   {Number}             numReports                  The number of reports that should be returned.
 * @apiQuery   {Number}             offset                      The offset from which the reports should be returned.
 * @apiSuccess {Object[]}           reports                     The list of reports.
 * @apiSuccess {String}             reports.reportText          The reason for the report.
 * @apiSuccess {Number}             reports.reportingUserID     The user id of the user that reported the poem.
 * @apiSuccess {String}             reports.reportingUsername   The username of the user that reported the poem.
 * @apiSuccess {String}             reports.reportingUserName   The displayname of the user that reported the poem.
 * @apiSuccess {Number}             reports.poemID              The id of the poem.
 * @apiSuccess {String}             reports.poemText            The text of the poem.
 * @apiSuccess {Date}               reports.timestamp           When this poem was posted.
 * @apiSuccess {Number}             reports.poetUserID          The user id of the user that posted the poem.
 * @apiSuccess {String}             reports.poetUsername        The username of the user that posted the poem.
 * @apiSuccess {String}             reports.poetDisplayname     The displayname of the user that posted the poem.
 * @apiSuccess {Number}             reports.rating              The rating of the poem.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200
 * [
 *   {
 *     "poemID": 81,
 *     "poemText": "I was in the darkness;\nI could not see my words\nNor the wishes of my heart.\nThen suddenly there was a great light --\n\n\"Let me into the darkness again.\"",
 *     "timestamp": "2022-09-30T14:32:25.000Z",
 *     "poetUserID": 16,
 *     "poetUsername": "афанасий",
 *     "poetDisplayname": "Афанасий",
 *     "reportText": "Способ забирать рабочий. Что потом направо а выразить хотеть мусор. Инфекция тревога изучить роскошный невыносимый задрать.",
 *     "reportingUserID": 32,
 *     "reportingUsername": "пелагея",
 *     "reportingDisplayname": "Пелагея",
 *     "rating": 18446744073709552000
 *   },
 *   {
 *     "poemID": 74,
 *     "poemText": "Dying at my music!\nBubble!  Bubble!\nHold me till the Octave's run!\nQuick!  Burst the Windows!\nRitardando!\nPhials left, and the Sun!",
 *     "timestamp": "2022-09-29T12:14:30.000Z",
 *     "poetUserID": 7,
 *     "poetUsername": "conny",
 *     "poetDisplayname": "Conny",
 *     "reportText": "Consectetur autem eos. Maxime ut nihil laborum. Quae dolorum ipsa quas provident.\nInventore corrupti officiis nostrum ad iusto at a. Odio ad exercitationem quis excepturi quibusdam.",
 *     "reportingUserID": 32,
 *     "reportingUsername": "пелагея",
 *     "reportingDisplayname": "Пелагея",
 *     "rating": 6
 *   }
 * ]
 */
poemsRouter.get('/reports/', authorize.isSignedIn, authorize.hasRole(rolesConfig.administrator), poemsController.getUserPoemReports)

/**
 * @api {post} poems/private/:id/report     Rate a specific poem
 * @apiParam {Number}       id              The id of the poem to be reported.
 * @apiBody  {String}       reportText      The reason of the report.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     User's unique session cookie.
 * @apiSuccess {String}     message         Status that the rating was successful.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200
 * {"message": "Report was successful."}
 */
poemsRouter.post('/private/:id/report/', authorize.isSignedIn, poemsController.reportUserPoemByID)

/**
 * @api {delete} poems/private/:id/report/:userID     Rate a specific poem
 * @apiParam {Number}       id                        The id of the poem of the report to be deleted.
 * @apiParam {Number}       userID                    The userID of the author of the report to be deleted.
 * @apiGroup PrivatePoems
 * @apiPermission admin
 * @apiHeader  {Cookie}     connect.sid     User's unique session cookie.
 * @apiSuccess {String}     message         Status that the rating was successful.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200
 * {"message": "Report deleted successfully."}
 */
poemsRouter.delete('/private/:id/report/:userID', authorize.isSignedIn, authorize.hasRole(rolesConfig.administrator), poemsController.deleteUserPoemReport)

/**
 * @api {post} poems/private/:id/favorite   Mark a specific poem as favorite
 * @apiParam {Number}       id              The id of the poem to be marked.
 * @apiBody  {Boolean}      favorite        Whether the favorite mark should be added or removed.
 * @apiGroup PrivatePoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     User's unique session cookie.
 * @apiSuccess {String}     message         Status that the deletion was successful.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200
 * {"message": "Report was successful."}
 */
poemsRouter.post('/private/:id/favorite/', authorize.isSignedIn, poemsController.favoriteUserPoemByID)

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
poemsRouter.get('/public', poemsController.getPublicPoem);

module.exports = poemsRouter;
