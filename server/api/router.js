/*
 * This file holds the router that will route the top level URIs under /v1/*.
 * It will route the request to the subsequent router that handles the next layer.
 */
'use strict';


// Define some general permissions that are used in the apidoc comments.
/**
 * @apiDefine admin
 * Only authorized administrative users can use this request.
 */
/**
 * @apiDefine anonymous
 * Only users that are not logged in can use this request.
 */
/**
 * @apiDefine user
 * All authorized users can use this request.
 */

const generalRouter = require('express').Router();
const authRouter = require('./routes/auth.route');
const poemsRouter = require('./routes/poems.route');

generalRouter.use('/auth', authRouter);
generalRouter.use('/poems', poemsRouter);

module.exports = generalRouter;