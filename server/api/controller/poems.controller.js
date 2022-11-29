/*
 *  This file holds the methods that are used in the authentication context.
 *  They will then be called by the corresponding routes in the auth router.
 */
'use strict';

const sql = require('../middleware/database');
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
    // Check whether the necessary fields are present.
    query('numPoems').optional().isInt().custom(async num => {return num > 0}).withMessage('The numPoems parameter is not a positive integer value.'),
    query('offset').optional().isInt().custom(async num => {return num >= 0}).withMessage('The offset parameter is not a positive integer value.'),
    query('orderBy').optional().custom(async orderBy => {return orderBy === 'date' || orderBy === 'rating'}).withMessage('The orderBy parameter is not a valid value.'),
    query('keywords.*').optional().isString().withMessage('The keywords parameter is not an array of string values.'),
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
                                    'WHERE userID = ?), 1, 0) AS isFollowing ' +
            'FROM PrivatePoem PP ' +
            'NATURAL JOIN User U ' +
            'LEFT OUTER JOIN PrivatePoemRating TPPR ON TPPR.poemID = PP.poemID ' +
            'LEFT OUTER JOIN PrivatePoemRating PPPR ON PPPR.poemID = PP.poemID AND PPPR.userID = ? ';

        for (let i = 0; i < keywords.length; i++) {
            if (i === 0) {
                statement += 'WHERE PP.poemText LIKE ? ';
            } else {
                statement += 'AND PP.poemText LIKE ? ';
            }
        }

        statement +=  'GROUP BY PP.poemID, PP.timestamp, PP.userID, U.username, U.displayname, rated, isFavorite, isFollowing ';

        switch(orderBy) {
            case 'date':
                statement += 'ORDER BY PP.timestamp ';
                break;
            case 'rating':
                statement += 'ORDER BY rating ';
        }

        statement += 'LIMIT ?, ?;';

    let rows = await sql.query(statement, [userID, userID, userID, ...keywords, offset, numPoems]);

    return res.status(200).json(rows);
}];




/*
 * Retrieves top 50 available poems ordered by date.
 * TODO: 
 */
exports.getTopUserPoems = async (req, res) => {
    let rows = await sql.query(' select p.poemID, p.poemText, p.userID, p.timestamp, rating, u.username\
    from (SELECT a.poemID, a.poemText,a.userID, a.timestamp, sum(rating) as rating\
            FROM PrivatePoem a JOIN PrivatePoemRating b on a.poemID = b.poemID\
            GROUP BY a.poemID ORDER BY timestamp limit 50)\
        p left join User u on p.userID = u.userID;'); 
    return res.status(200).json(rows);
};

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

        let rows = await sql.query('SELECT * FROM PrivatePoem WHERE poemID = ?', poemID);

        if (rows.length !== 1) {
            return res.status(403).send({errors: [`No poem with id ${poemID} found.`]})
        }

        return res.status(200).json(rows[0]);
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



exports.getUserID = async (req, res) => {
    return res.status(200).json(req.session.userID)
};


exports.postUpdateRatings = [
    param('id').isInt({min: 1, allow_leading_zeroes: false}).withMessage('Error: invalid Poem ID'),
    param('vote').isInt({min: -1, max: 1, allow_leading_zeroes: false}).withMessage('Error: forbidden vote'),
    async (req, res) => {
        // If some fields were not present, return the corresponding errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        let poemID = req.params.id.toString()
        let vote = req.params.vote.toString();
        let userID = req.session.userID.toString();
        
        if(req.params.vote != 0){
            await sql.query("INSERT INTO  PrivatePoemRating (poemID, userID, rating) "+
            "VALUES (" + poemID +","+ userID + "," + vote + ")  "+
            "ON DUPLICATE KEY UPDATE rating = "+ vote +";");
            return res.status(200).send({message : 'OK'});
        }else{
            return res.status(418).send({error: 'Im a teapot; also you tried to vote 0'});
        }
}];


exports.postDeletePoem = [
    param('id').isInt({min: 1, allow_leading_zeroes: false}).withMessage('Error: invalid Poem ID'),
    async (req, res) => {
        // If some fields were not present, return the corresponding errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        let poemID = req.params.id.toString()
        let userID = req.session.userID.toString();
        
        let toBeDeleted = await sql.query('SELECT * FROM PrivatePoem WHERE poemID = ? AND userID = ?', [poemID, userID]);

        if (toBeDeleted.length !== 1) {
            return res.status(403).send({ errors: [`ERROR: No poem by user ${userID} with id ${poemID} found. Invalid PoemID or User not Author`], deleteList: JSON.stringify(toBeDeleted) })
        }
        await sql.query("DELETE FROM PrivatePoem where poemID = ? AND userID = ?", [poemID, userID])
        return res.status(200).send({status: "OK" , poem_removed : toBeDeleted})
    }
];

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