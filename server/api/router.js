/*
 * This file holds the router that will route the top level URIs under /v1/*.
 * It will route the request to the subsequent router that handles the next layer.
 */
'use strict';

const generalRouter = require('express').Router();
const authRouter = require('./routes/auth.route');
const poemsRouter = require('./routes/poems.route');

generalRouter.use('/auth', authRouter);
generalRouter.use('/poems', poemsRouter);

module.exports = generalRouter;