const Genre = require('../models/genre');
const Album = require('../models/album');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({ name: 1 }).exec();

    res.render('./genre/genre_list', {
        title: 'All Genres',
        genres: allGenres,
    });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, allAlbumsByGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Album.find({ genre: req.params.id }).populate('artist').exec(),
    ]);

    if (genre === null) {
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
    }

    res.render('./genre/genre_detail', {
        genre: genre,
        albums: allAlbumsByGenre,
    });
});

exports.genre_create_get = asyncHandler(async (req, res, next) => {
    res.render('./genre/genre_form', { title: 'Add Genre', genre: undefined });
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
            res.render('./genre/genre_form', {
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
    const genre = await Genre.findById(req.params.id).exec();

    if (genre === null) {
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }
    
    res.render('./genre/genre_form', {
        title: 'Update Genre',
        genre: genre,
    });
});

exports.genre_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});