const Album = require('../models/album');
const Artist = require('../models/artist');
const Label = require('../models/label');
const Genre = require('../models/genre');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.album_list = asyncHandler(async (req, res, next) => {
    const allAlbums = await Album.find().sort({ title: 1 }).exec();

    res.render('album_list', {
        title: 'All Albums',
        albums: allAlbums,
    });
});

exports.album_detail = asyncHandler(async (req, res, next) => {
    const album = await Album.findById(req.params.id).populate('artist label genre').exec();

    if (album === null) {
        const err = new Error('Album not found');
        err.status = 404;
        return next(err);
    }

    res.render('album_detail', {
        album: album,
    });
});

exports.album_create_get = asyncHandler(async (req, res, next) => {
    const [allArtists, allLabels, allGenres] = await Promise.all([
        Artist.find().sort({ last_name: 1 }).exec(),
        Label.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
    ]);

    res.render('album_form', {
        title: 'Add Album',
        album: undefined,
        artists: allArtists,
        labels: allLabels,
        genres: allGenres,
    });
});

exports.album_create_post = [
    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("artist", "Artist must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('release_date', 'Invalid release date.')
        .isISO8601()
        .toDate(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const album = new Album({
            title: req.body.title,
            artist: req.body.artist,
            release_date: req.body.release_date,
            label: req.body.label,
            genre: req.body.genre,
            image: req.body.image,
        });

        if (!errors.isEmpty()) {
            const [allArtists, allLabels, allGenres] = await Promise.all([
                Artist.find().sort({ last_name: 1 }).exec(),
                Label.find().sort({ name: 1 }).exec(),
                Genre.find().sort({ name: 1 }).exec(),
            ]);

            res.render('album_form', {
                title: 'Add Album',
                album: album,
                artists: allArtists,
                labels: allLabels,
                genres: allGenres,
                errors: errors.array(),
            });
        } else {
            await album.save();
            res.redirect(album.url);
        }
    }),
];

exports.album_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.album_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.album_update_get = asyncHandler(async (req, res, next) => {
    const [album, allArtists, allLabels, allGenres] = await Promise.all([
        Album.findById(req.params.id).exec(),
        Artist.find().sort({ last_name: 1 }).exec(),
        Label.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
    ]);

    if (album === null) {
        const err = new Error("Album not found");
        err.status = 404;
        return next(err);
    }

    res.render('album_form', {
        title: 'Add Album',
        album: album,
        artists: allArtists,
        labels: allLabels,
        genres: allGenres,
    });
});

exports.album_update_post = [
    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("artist", "Artist must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('release_date', 'Invalid release date.')
        .isISO8601()
        .toDate(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const album = new Album({
            title: req.body.title,
            artist: req.body.artist,
            release_date: req.body.release_date,
            label: req.body.label,
            genre: req.body.genre,
            image: req.body.image,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            const [allArtists, allLabels, allGenres] = await Promise.all([
                Artist.find().sort({ last_name: 1 }).exec(),
                Label.find().sort({ name: 1 }).exec(),
                Genre.find().sort({ name: 1 }).exec(),
            ]);

            res.render('album_form', {
                title: 'Add Album',
                album: album,
                artists: allArtists,
                labels: allLabels,
                genres: allGenres,
                errors: errors.array(),
            });
        } else {
            const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, album, {});
            res.redirect(updatedAlbum.url);
        }
    }),
];