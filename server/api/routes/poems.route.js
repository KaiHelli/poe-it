/*
 * This file routes all available features that lie underneath the /api/poems/* URI.
 * It thereby uses middleware checks to verify if e.g. a user is authorized to access it.
 * It will then route the request to the method of the controller that handles it.
 */
'use strict';

const authRouter = require('express').Router();
const poemsController = require('../controller/poems.controller');
const authorize = require('../middleware/authorize')

authRouter.get('/private/', authorize.isSignedIn, poemsController.getUserPoems);

// TODO: Add additional features.
// authRouter.post('/private/', authorize.isSignedIn, poemsController.insertUserPoem);

authRouter.get('/private/:id', authorize.isSignedIn, poemsController.getUserPoemByID);

// authRouter.delete('/private/:id', authorize.isSignedIn, poemsController.deleteUserPoemByID);

// authRouter.get('/public/', poemsController.getPublicPoems);

// authRouter.get('/public/:id', poemsController.getPublicPoemByID);

module.exports = authRouter;