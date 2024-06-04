const Genre = require('../models/genre');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.genre_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.genre_create_get = asyncHandler(async (req, res, next) => {
    res.render('genre_form', { title: 'Add Genre', genre: undefined });
});

exports.genre_create_post = [
    body('name', 'Genre name must contain at least 1 character.')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre({ name: req.body.name });

        if (!errors.isEmpty()) {
            res.render('genre_form', {
                title: 'Add Genre',
                genre: genre,
                errors: errors.array(),
            });
            return;
        } else {
            const genreExists = await Genre.findOne({ name: req.body.name })
                .collation({ locale: 'en', strength: 2 })
                .exec();
            if (genreExists) {
                res.redirect(genreExists.url);
            } else {
                await genre.save();
                res.redirect(genre.url);
            }
        }
    }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.genre_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});