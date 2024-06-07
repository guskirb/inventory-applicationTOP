const Artist = require('../models/artist');
const Album = require('../models/album');
const Format = require('../models/format');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.artist_list = asyncHandler(async (req, res, next) => {
    const allArtists = await Artist.find().sort({ first_name: 1 }).exec();

    res.render('./artist/artist_list', {
        title: 'All Artists',
        artists: allArtists,
    });
});

exports.artist_detail = asyncHandler(async (req, res, next) => {
    let artist, allAlbumsByArtist, allFormatsByArtist;
    try {
        [artist, allAlbumsByArtist,] = await Promise.all([
            Artist.findById(req.params.id).exec(),
            Album.find({ artist: req.params.id }, 'title release_date label image').populate('label').exec(),
        ]);

        allFormatsByArtist = await Format.find({ album: allAlbumsByArtist }).populate('album').sort({ stock: 1 }).exec();

    } catch (err) {
        res.redirect('/category/artists');
    }

    res.render('./artist/artist_detail', {
        artist: artist,
        artist_albums: allAlbumsByArtist,
        artist_formats: allFormatsByArtist,
    });
});

exports.artist_create_get = asyncHandler(async (req, res, next) => {
    res.render('./artist/artist_form', {
        title: 'Add Artist',
        artist: undefined,
        errors: undefined,
    });
});

exports.artist_create_post = [
    body('first_name', 'First name must be specified.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('last_name')
        .trim()
        .escape(),
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
            image: req.body.image,
        });

        if (!errors.isEmpty()) {
            res.render('./artist/artist_form', {
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
    let artist, allAlbumsByArtist;
    try {
        [artist, allAlbumsByArtist] = await Promise.all([
            Artist.findById(req.params.id).exec(),
            Album.find({ artist: req.params.id }, 'title release_date image').exec(),
        ]);
    } catch (err) {
        res.redirect('/category/artists');
    }

    res.render('./artist/artist_delete', {
        artist: artist,
        artist_albums: allAlbumsByArtist,
    });
});

exports.artist_delete_post = asyncHandler(async (req, res, next) => {
    const [artist, allAlbumsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Album.find({ artist: req.params.id }, 'title release_date image').exec(),
    ]);

    if (allAlbumsByArtist.length > 0) {
        res.render('./artist/artist_delete', {
            artist: artist,
            artist_albums: allAlbumsByArtist,
        });
        return;
    } else {
        await Artist.findByIdAndDelete(req.params.id);
        res.redirect('/category/artists');
    }
});

exports.artist_update_get = asyncHandler(async (req, res, next) => {
    let artist;
    try {
        artist = await Artist.findById(req.params.id).exec();
    } catch (err) {
        res.redirect('/category/artists');
    }

    res.render('./artist/artist_form', {
        title: 'Update Artist',
        artist: artist,
        errors: undefined,
    });
});

exports.artist_update_post = [
    body('first_name', 'First name must be specified.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('last_name')
        .trim()
        .escape(),
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
            image: req.body.image,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            res.render('./artist/artist_form', {
                title: 'Update Artist',
                artist: artist,
                errors: errors.array(),
            });
            return;
        } else {
            const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, artist, {})
            res.redirect(updatedArtist.url);
        }
    }),
];