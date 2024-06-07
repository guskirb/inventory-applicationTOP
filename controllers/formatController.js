const Format = require('../models/format');
const Album = require('../models/album');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.format_list = asyncHandler(async (req, res, next) => {
    const allFormats = await Format.find().populate({
        path: 'album',
        select: 'title',
        options: { sort: { "title": 1 } },
        populate: {
            path: 'artist',
            model: 'Artist',
        },
    }).sort({ stock: 1 }).exec();

    res.render('./format/format_list', {
        title: 'All Releases',
        formats: allFormats,
    });
});

exports.format_detail = asyncHandler(async (req, res, next) => {
    let format;
    try {
        format = await Format.findById(req.params.id).populate({
            path: 'album',
            populate: [{
                path: 'artist',
                model: 'Artist'
            }, {
                path: 'label',
                model: 'Label'
            }, {
                path: 'genre',
                model: 'Genre'
            }],
        }).exec();
    } catch (err) {
        res.redirect('/category/releases');
    }

    res.render('./format/format_detail', {
        format: format,
    });
});

exports.format_create_get = asyncHandler(async (req, res, next) => {
    const allAlbums = await Album.find().sort({ title: 1 }).populate('artist').exec();

    res.render('./format/format_form', {
        title: 'Add Release',
        format: undefined,
        albums: allAlbums,
        errors: undefined,
    });
});

exports.format_create_post = [
    body('album', 'Album must be specified').trim().isLength({ min: 1 }).escape(),
    body('format', 'Format must be specified.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be specified.').isNumeric(),
    body('stock', 'Stock amount must be specified.').isNumeric(),
    body('barcode', 'Barcode must be specified.')
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
            image: req.body.image,
        });

        if (!errors.isEmpty()) {
            const allAlbums = await Album.find().sort({ title: 1 }).populate('artist').exec();

            res.render('./format/format_form', {
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
    let format;
    try {
        format = await Format.findById(req.params.id).populate('album').exec();
    } catch (err) {
        res.redirect('/category/releases');
    }

    res.render('./format/format_delete', {
        format: format,
    });
});

exports.format_delete_post = asyncHandler(async (req, res, next) => {
    await Format.findByIdAndDelete(req.params.id);
    res.redirect('/category/releases');
});

exports.format_update_get = asyncHandler(async (req, res, next) => {
    let format, allAlbums;
    try {
        [format, allAlbums] = await Promise.all([
            Format.findById(req.params.id).exec(),
            Album.find().sort({ title: 1 }).populate('artist').exec(),
        ]);
    } catch (err) {
        res.redirect('/category/releases');
    }

    res.render('./format/format_form', {
        title: 'Update Release',
        format: format,
        albums: allAlbums,
        errors: undefined,
    });
});

exports.format_update_post = [
    body('album', 'Album must be specified').trim().isLength({ min: 1 }).escape(),
    body('format', 'Format must be specified.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be specified.').isNumeric(),
    body('stock', 'Stock amount must be specified.').isNumeric(),
    body('barcode', 'Barcode must be specified.')
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
            image: req.body.image,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            const allAlbums = await Album.find().sort({ title: 1 }).populate('artist').exec();

            res.render('./format/format_form', {
                title: 'Update Release',
                format: format,
                albums: allAlbums,
                errors: errors.array(),
            });
        } else {
            const updatedFormat = await Format.findByIdAndUpdate(req.params.id, format, {});
            res.redirect(updatedFormat.url);
        }
    }),
];