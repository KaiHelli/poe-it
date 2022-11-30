/*
 * This file routes all available features that lie underneath the /v1/user/* URI.
 * It thereby uses middleware checks to verify if e.g. a user is authorized to access it.
 * It will then route the request to the method of the controller that handles it.
 */
'use strict';

const userRouter = require('express').Router();
const userController = require('../controller/user.controller');
const authorize = require('../middleware/authorize')

/**
 * @api {post} poems/private/:id/favorite   Follow a specific user
 * @apiParam {Number}       id              The id of the user to be followed.
 * @apiBody  {Boolean}      follow          Whether the follow should be added or removed.
 * @apiGroup PublicPoems
 * @apiPermission user
 * @apiHeader  {Cookie}     connect.sid     User's unique session cookie.
 * @apiHeader  {Number}     userId          User's id.
 * @apiSuccess {String}     message         Status that the rating was successful.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200
 * {"message": "Follow operation was successful."}
 */
userRouter.post('/:id/follow', authorize.isSignedIn, userController.followUserByID);

module.exports = userRouter;