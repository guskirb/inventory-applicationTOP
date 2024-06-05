const Artist = require('../models/artist');
const Album = require('../models/album');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.artist_list = asyncHandler(async (req, res, next) => {
    const allArtists = await Artist.find().sort({ last_name: 1 }).exec();

    res.render('artist_list', {
        title: 'All Artists',
        artists: allArtists,
    });
});

exports.artist_detail = asyncHandler(async (req, res, next) => {
    const [artist, allAlbumsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Album.find({ artist: req.params.id }, 'title release_date label').populate('label').exec(),
    ]);

    if (artist === null) {
        const err = new Error('Artist not found');
        err.status = 404;
        return next(err);
    }

    res.render('artist_detail', {
        artist: artist,
        artist_albums: allAlbumsByArtist,
    });
});

exports.artist_create_get = asyncHandler(async (req, res, next) => {
    res.render('artist_form', { title: 'Add Artist', artist: undefined });
});

exports.artist_create_post = [
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),
    body('last_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Last name must be specified.')
        .isAlphanumeric()
        .withMessage('Last name has non-alphanumeric characters.'),
    body('birth_date', 'Invalid date of birth.')
        .isISO8601()
        .toDate(),
    body('death_date', 'Invalid date of birth.')
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body('country')
        .optional({ values: "falsy" })
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const artist = new Artist({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birth_date: req.body.birth_date,
            death_date: req.body.death_date,
            country: req.body.country,
        })

        if (!errors.isEmpty()) {
            res.render('artist_form', {
                title: 'Add Artist',
                artist: artist,
                errors: errors.array(),
            });
            return;
        } else {
            await artist.save();
            res.redirect(artist.url);
        }
    }),
];

exports.artist_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.artist_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.artist_update_get = asyncHandler(async (req, res, next) => {
    const artist = await Artist.findById(req.params.id).exec();

    if (artist === null) {
        const err = new Error("Artist not found");
        err.status = 404;
        return next(err);
    }

    res.render('artist_form', {
        title: 'Update Artist',
        artist: artist,
    });
});

exports.artist_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});