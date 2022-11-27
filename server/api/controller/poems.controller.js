/*
 *  This file holds the methods that are used in the authentication context.
 *  They will then be called by the corresponding routes in the auth router.
 */
'use strict';

const sql = require('../middleware/database');
const {body, param, validationResult} = require('express-validator');

/*
 * Retrieves all available poems.
 * TODO: Implement paging?
 */

exports.getUserPoems = async (req, res) => {
    let rows = await sql.query('SELECT *  FROM PrivatePoem;');

    return res.status(200).json(rows);
};


/*
 * Retrieves top 50 available poems ordered by date.
 * TODO: 
 */
exports.getTopUserPoems = async (req, res) => {
    let rows = await sql.query('SELECT * FROM PrivatePoem ORDER BY timestamp limit 50;');
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


exports.getPublicPoem = async (req, res) => {
    let rows = await sql.query('SELECT poemID, poemTitle, poemText, poetName ' +
                                        'FROM PublicPoem NATURAL JOIN PublicPoemTags ' +
                                        'ORDER BY RAND() ' +
                                        'LIMIT 1;');

    return res.status(200).json(rows[0]);
};
