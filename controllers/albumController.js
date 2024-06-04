const Album = require('../models/album');
const Artist = require('../models/artist');
const Label = require('../models/label');
const Genre = require('../models/genre');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.album_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.album_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
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

exports.album_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.album_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.album_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.album_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.album_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});