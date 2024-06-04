const Format = require('../models/format');
const Album = require('../models/album');
const asyncHandler = require('express-async-handler');

exports.format_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.format_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.format_create_get = asyncHandler(async (req, res, next) => {
    const allAlbums = await Album.find().sort({ title: 1 }).exec();

    res.render('format_form', {
        title: 'Add Release',
        format: undefined,
        albums: allAlbums,
    });
});

exports.format_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.format_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.format_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.format_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.format_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});