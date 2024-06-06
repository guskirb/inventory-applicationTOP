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
    let genre, allAlbumsByGenre;
    try {
        [genre, allAlbumsByGenre] = await Promise.all([
            Genre.findById(req.params.id).exec(),
            Album.find({ genre: req.params.id }).populate('artist').exec(),
        ]);
    } catch (err) {
        res.redirect('/category/genres');
    }

    res.render('./genre/genre_detail', {
        genre: genre,
        albums: allAlbumsByGenre,
    });
});

exports.genre_create_get = asyncHandler(async (req, res, next) => {
    res.render('./genre/genre_form', {
        title: 'Add Genre',
        genre: undefined,
        errors: undefined,
    });
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
    let genre;
    try {
        genre = await Genre.findById(req.params.id).exec();
    } catch (err) {
        res.redirect('/category/genres');
    }

    res.render('./genre/genre_form', {
        title: 'Update Genre',
        genre: genre,
        errors: undefined,
    });
});

exports.genre_update_post = [
    body('name', 'Genre name must contain at least 1 character.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre({
            name: req.body.name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render('./genre/genre_form', {
                title: 'Update Genre',
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
                const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
                res.redirect(updatedGenre.url);
            }
        }
    }),
];