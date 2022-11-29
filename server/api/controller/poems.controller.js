/*
 *  This file holds the methods that are used in the poem context.
 *  They will then be called by the corresponding routes in the poem router.
 */
'use strict';

const sql = require('../middleware/database');
const authorize = require('../middleware/authorize');
const rolesConfig = require('../configs/roles.config')
const {body, param, query, validationResult} = require('express-validator');

const msgOnlyValidationResult = validationResult.withDefaults({
    formatter: error => {
        return error.msg;
    }
});

/*
 * Retrieves all available poems.
 */
exports.getUserPoems = [
    // TODO: Validation of URL parameter does not work. Maybe has to do with the optional().
    // Check whether the necessary fields are present.
    query('numPoems').optional().isInt({min: 1}).withMessage('The numPoems parameter is not a positive integer value.'),
    query('offset').optional().isInt({min: 0}).withMessage('The offset parameter is not a positive integer value.'),
    query('orderBy').optional().custom(async orderBy => {return orderBy === 'date' || orderBy === 'rating'}).withMessage('The orderBy parameter is not a valid value.'),
    query('keywords.*').optional().isString().withMessage('The keywords parameter is not an array of string values.'),
    query('filterFavorite').optional().isBoolean().withMessage('The keywords parameter is not an array of string values.'),
    query('filterFollowing').optional().isBoolean().withMessage('The keywords parameter is not an array of string values.'),
    query('filterPersonal').optional().isBoolean().withMessage('The keywords parameter is not an array of string values.'),
    async (req, res) => {
    // If some validation failed, return the errors that occurred.
    const errors = msgOnlyValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    let userID = req.session.userID;

    let keywords = req.query.keywords || [];

    if (!Array.isArray(keywords)) {
        keywords = [keywords];
    }

    let orderBy = req.query.orderBy || 'date';
    let numPoems = parseInt(req.query.numPoems) || 20;
    let offset = parseInt(req.query.offset) || 0;

    let filterFavorite = (req.query.filterFavorite || 'false') === 'true';
    let filterFollowing = (req.query.filterFollowing || 'false') === 'true';
    let filterPersonal = (req.query.filterPersonal || 'false') === 'true';

    for (let i = 0; i < keywords.length; i++) {
        keywords[i] = '%' + keywords[i] + '%';
    }

    let statement = 'SELECT PP.poemID, PP.poemText, PP.timestamp, PP.userID, U.username, U.displayname, ' +
                    'SUM(IFNULL(TPPR.rating,0)) AS rating, ' +
                    'PPPR.rating AS rated,  ' +
                    'IF(PP.poemID IN (SELECT poemID ' +
                                    'FROM PrivatePoemFavorites ' +
                                    'WHERE userID = ?), 1, 0) AS isFavorite, ' +
                    'IF(PP.userID IN (SELECT followedUserID ' +
                                    'FROM UserFollowing ' +
                                    'WHERE userID = ?), 1, 0) AS isFollowing,' +
                    'IF(PP.poemID IN (SELECT poemID ' +
                                    'FROM PrivatePoemReports ' +
                                    'WHERE userID = ?), 1, 0) AS isReported ' +
                    'FROM PrivatePoem PP ' +
                    'NATURAL JOIN User U ' +
                    'LEFT OUTER JOIN PrivatePoemRating TPPR ON TPPR.poemID = PP.poemID ' +
                    'LEFT OUTER JOIN PrivatePoemRating PPPR ON PPPR.poemID = PP.poemID AND PPPR.userID = ? ' +
                    'WHERE TRUE ';

    if (keywords.length > 0) {
        statement += 'AND (';
        statement += Array(keywords.length).fill('PP.poemText Like ?').join(' AND ');
        statement += ') ';
    }

    if (filterPersonal === true) {
        statement += 'AND PP.userID = ? '
    }

    statement +=  'GROUP BY PP.poemID, PP.timestamp, PP.userID, U.username, U.displayname, rated, isFavorite, isFollowing, isReported ' +
                  'HAVING TRUE ';

    if (filterFavorite === true) {
        statement += 'AND isFavorite = 1 '
    }

    if (filterFollowing === true) {
        statement += 'AND isFollowing = 1 '
    }

    switch(orderBy) {
        case 'date':
            statement += 'ORDER BY PP.timestamp DESC, rating DESC ';
            break;
        case 'rating':
            statement += 'ORDER BY rating DESC, PP.timestamp DESC ';
    }

    statement += 'LIMIT ?, ?;';

    let params;

    if (filterPersonal === true) {
        params = [userID, userID, userID, userID, ...keywords, userID, offset, numPoems];
    } else {
        params = [userID, userID, userID, userID, ...keywords, offset, numPoems];
    }

    let rows = await sql.query(statement, params);

    return res.status(200).json(rows);
}];

/*
 * Retrieve a poem by its id.
 */
exports.getUserPoemByID = [
    param('id').isInt({min: 1}).withMessage('Invalid id.'),
    async (req, res) => {
        // If some fields were not present, return the corresponding errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        let poemID = req.params.id;
        let userID = req.session.userID;

        let statement = 'SELECT PP.poemID, PP.poemText, PP.timestamp, PP.userID, U.username, U.displayname, ' +
                        'SUM(IFNULL(TPPR.rating,0)) AS rating, ' +
                        'PPPR.rating AS rated,  ' +
                        'IF(PP.poemID IN (SELECT poemID ' +
                                    'FROM PrivatePoemFavorites ' +
                                    'WHERE userID = ?), 1, 0) AS isFavorite, ' +
                        'IF(PP.userID IN (SELECT followedUserID ' +
                                    'FROM UserFollowing ' +
                                    'WHERE userID = ?), 1, 0) AS isFollowing, ' +
                        'IF(PP.poemID IN (SELECT poemID ' +
                                    'FROM PrivatePoemReports ' +
                                    'WHERE userID = ?), 1, 0) AS isReported ' +
                        'FROM PrivatePoem PP ' +
                        'NATURAL JOIN User U ' +
                        'LEFT OUTER JOIN PrivatePoemRating TPPR ON TPPR.poemID = PP.poemID ' +
                        'LEFT OUTER JOIN PrivatePoemRating PPPR ON PPPR.poemID = PP.poemID AND PPPR.userID = ? ' +
                        'WHERE PP.poemID = ? ' +
                        'GROUP BY PP.poemID, PP.timestamp, PP.userID, U.username, U.displayname, rated, isFavorite, isFollowing, isReported;';
        ;

        let rows = await sql.query(statement, [userID, userID, userID, userID, poemID]);

        if (rows.length !== 1) {
            return res.status(403).send({errors: [`No poem with id ${poemID} found.`]})
        }

        return res.status(200).json(rows[0]);
}];

/*
 * Update the text of a poem.
 */
exports.updateUserPoemByID = [
    param('id').isInt({min: 1, allow_leading_zeroes: false}).withMessage('Invalid Poem ID.'),
    body('poemText').isLength({min: 1, max: 256}).withMessage('Poem should have 1 to 256 characters.'),
    async (req, res, next) => {
        // If some fields were not present, return the corresponding errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        let poemID = req.params.id;
        let userID = req.session.userID;

        let rows = await sql.query('SELECT userID FROM PrivatePoem WHERE poemID = ?;', [poemID]);

        if (rows.length !== 1) {
            return res.status(403).send({errors: [`No poem with id ${poemID} found.`]})
        }

        if (userID === rows[0].userID) {
            next();
        } else {
            await authorize.hasRole(rolesConfig.administrator)(req, res, next);
        }
    },
    async (req, res) => {
        let poemID = req.params.id;
        let poemText = req.body.poemText;

        await sql.query("UPDATE PrivatePoem SET poemText = ? WHERE poemID = ?", [poemText, poemID])

        return res.status(200).send({message: "Poem updated successfully."})
    }
];

/*
 * Delete a poem.
 */
exports.deleteUserPoemByID = [
    param('id').isInt({min: 1, allow_leading_zeroes: false}).withMessage('Invalid Poem ID.'),
    async (req, res, next) => {
        // If some fields were not present, return the corresponding errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        let poemID = req.params.id;
        let userID = req.session.userID;

        let rows = await sql.query('SELECT userID FROM PrivatePoem WHERE poemID = ?;', [poemID]);

        if (rows.length !== 1) {
            return res.status(403).send({errors: [`No poem with id ${poemID} found.`]})
        }

        if (userID === rows[0].userID) {
            next();
        } else {
            await authorize.hasRole(rolesConfig.administrator)(req, res, next);
        }
    },
    async (req, res) => {
        let poemID = req.params.id;

        await sql.query("DELETE FROM PrivatePoem WHERE poemID = ?", [poemID])

        return res.status(200).send({message: "Poem deleted successfully."})
    }
];

/*
 * Vote for a poem.
 */
exports.postUpdateRatings = [
    param('id').isInt({min: 1, allow_leading_zeroes: false}).withMessage('Invalid Poem ID.'),
    param('rating').isInt({min: -1, max: 1, allow_leading_zeroes: false}).custom(value => {return value !== 0}).withMessage('Given rating is invalid.'),
    async (req, res) => {
        // If some fields were not present, return the corresponding errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        let poemID = req.params.id;
        let rating = req.params.rating;
        let userID = req.session.userID;

        let rows = await sql.query("SELECT PPR.rating AS rated " +
                                            "FROM PrivatePoem PP " +
                                            "LEFT OUTER JOIN PrivatePoemRating PPR ON PPR.poemID = PP.poemID AND PPR.userID = ? " +
                                            "WHERE PP.poemID = ?", [userID, poemID]);

        if (rows.length !== 1) {
            return res.status(403).send({errors: [`No poem with id ${poemID} found.`]});
        }

        if (rows[0].rated !== null) {
            return res.status(403).send({errors: [`User has already voted for poem with id ${poemID}`]});
        }

        await sql.query("INSERT INTO PrivatePoemRating (poemID, userID, rating) "+
                        "VALUES (?, ?, ?);", [poemID, userID, rating]);

        return res.status(200).send({message : 'Rating was successful.'});
    }];

/*
* Get a random public poem
*/
exports.getPublicPoem = async (req, res) => {
    let rows = await sql.query('SELECT poemID, poemTitle, poemText, poetName ' +
        'FROM PublicPoem NATURAL JOIN PublicPoemTags ' +
        'ORDER BY RAND() ' +
        'LIMIT 1;');

    return res.status(200).json(rows[0]);
};

// DUMPS
exports.getRatingsDump = async (req, res) => {
    let rows = await sql.query('SELECT *  FROM PrivatePoemRating;');
    return res.status(200).json(rows);
};

exports.getFollowsDump = async (req, res) => {
    let rows = await sql.query('SELECT *  FROM UserFollowing;');
    return res.status(200).json(rows);
};

exports.getFavoritesDump = async (req, res) => {
    let rows = await sql.query('SELECT *  FROM PrivatePoemFavorites;');
    return res.status(200).json(rows);
};

exports.publishPublicPoem = async(req, res) => {
    await sql.query('INSERT INTO PrivatePoem SET userID = ?, poemText = ?', [req.body.userID, req.body.poemText]);
    return res.status(200).json({message: 'Poem published successfully.'});
};