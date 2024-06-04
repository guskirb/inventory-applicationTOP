const Format = require('../models/format');
const Album = require('../models/album');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.format_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.format_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.format_create_get = asyncHandler(async (req, res, next) => {
    const allAlbums = await Album.find().sort({ title: 1 }).populate('artist').exec();

    res.render('format_form', {
        title: 'Add Release',
        format: undefined,
        albums: allAlbums,
    });
});

exports.format_create_post = [
    body('album', 'Album must be specified').trim().isLength({ min: 1 }).escape(),
    body('format', 'Format must be specified.').escape(),
    body('price', 'Price must be specified.').isNumeric().withMessage('Only Decimals allowed'),
    body('stock', 'Stock amount must be specified.').isNumeric().withMessage('Only Decimals allowed'),
    body('barcode', 'Barcode must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const format = new Format({
            album: req.body.album,
            format: req.body.format,
            price: req.body.price,
            stock: req.body.stock,
            barcode: req.body.barcode,
        });

        if (!errors.isEmpty()) {
            const allAlbums = await Album.find().sort({ title: 1 }).populate('artist').exec();

            res.render('format_form', {
                title: 'Add Release',
                format: format,
                albums: allAlbums,
                errors: errors.array(),
            });
        } else {
            await format.save();
            res.redirect(format.url);
        }
    }),
];

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