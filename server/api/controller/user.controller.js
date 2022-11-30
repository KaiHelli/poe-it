/*
 *  This file holds the methods that are used in the user context.
 *  They will then be called by the corresponding routes in the user router.
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
 * Follow a specific user.
 */
exports.followUserByID = [
    param('id').isInt({min: 1, allow_leading_zeroes: false}).withMessage('Invalid User ID.'),
    body('follow').isBoolean().withMessage('Invalid follow bool.'),
    async (req, res) => {
        // If some fields were not present, return the corresponding errors.
        const errors = msgOnlyValidationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        let followedUserID = req.params.id;
        let userID = req.session.userID;
        let follow = req.body.follow;

        if (followedUserID === userID) {
            return res.status(403).send({errors: [`A user cannot follow themselves.`]});
        }

        let rows = await sql.query("SELECT U.userID AS followedUserID, UF.userID " +
                                    "FROM User U " +
                                    "LEFT OUTER JOIN UserFollowing UF ON UF.followedUserID = U.userID AND UF.userID = ? " +
                                    "WHERE U.userID = ?;", [userID, followedUserID]);

        if (rows.length !== 1) {
            return res.status(403).send({errors: [`No user with id ${followedUserID} found.`]});
        }

        let followExists = rows[0].userID !== null;

        if ((followExists && follow) || (!followExists && !follow)) {
            return res.status(403).send({errors: [`The state you try to achieve is already met.`]});
        }

        if (follow) {
            await sql.query("INSERT INTO UserFollowing (userID, followedUserID) "+
                "VALUES (?, ?);", [userID, followedUserID]);
        } else {
            await sql.query("DELETE FROM UserFollowing "+
                "WHERE userID = ? AND followedUserID = ?;", [userID, followedUserID]);
        }

        return res.status(200).send({message : 'Follow operation was successful.'});
    }];

exports.getUserStatsByID = async (req, res) => {
        let userID = req.session.userID;

        let rows = await sql.query('WITH num AS ' +
                                    '  (SELECT COUNT(*) AS numPoems ' +
                                    '  FROM PrivatePoem ' +
                                    '  WHERE userID = ?), ' +
                                    'sum AS ' +
                                    '  (SELECT CAST(IFNULL(SUM(IFNULL(PPR.rating,0)),0) AS SIGNED) AS totalScore ' +
                                    '  FROM PrivatePoem PP ' +
                                    '  LEFT OUTER JOIN PrivatePoemRating PPR ON PPR.poemID = PP.poemID ' +
                                    '  WHERE PP.userID = ?) ' +
                                    'SELECT num.numPoems, sum.totalScore ' +
                                    'FROM num, sum;', [userID, userID]);

        if (rows.length !== 1) {
            return res.status(403).send({errors: [`No statistics for user with id ${userID} found.`]});
        }

        return res.status(200).send(rows[0]);
    };