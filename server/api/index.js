'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');

// Import the general router.
const generalRouter = require('./router');
// Import the database connection.
const sql = require('./middleware/database');
// Import the middleware that will set the encoding to JSON and utf8 for all responses.
const {setUtf8Encoding} = require('./middleware/helper')

const app = express();
const port = 8080;

// Allow the frontend requests to the backend.
const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true
};
app.use(cors(corsOptions));

// Set up the session module that will handle logins.
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sql.sessionStore,
    resave: false,
    saveUninitialized: false
}));

// In case we are in a production environment, the cookie should only be delivered
// if the connection is encrypted.
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)       // trust the first proxy
    session.cookie.secure = true    // serve secure cookies
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Return some welcome message on the root URI.
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Poe-it API.' });
});

// Return the api documentation on the docs URI.
app.use('/docs', express.static('docs'));

// Route all requests underneath the URI /v1/* to the general router.
app.use('/v1', generalRouter)

// Start to listen for requests on the specified port.
app.listen(port, () => {console.log(`Poe-it API listening on port ${port}!`);});