const Label = require('../models/label');
const Album = require('../models/album');
const Format = require('../models/format');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.label_list = asyncHandler(async (req, res, next) => {
    const allLabels = await Label.find().sort({ name: 1 }).exec();

    res.render('./label/label_list', {
        title: 'All Labels',
        labels: allLabels,
    });
});

exports.label_detail = asyncHandler(async (req, res, next) => {
    let label, allAlbumsByLabel, allFormatsByLabel;
    try {
        [label, allAlbumsByLabel] = await Promise.all([
            Label.findById(req.params.id).exec(),
            Album.find({ label: req.params.id }).populate('artist').exec(),
        ]);

        allFormatsByLabel = await Format.find({ album: allAlbumsByLabel }).populate('album').sort({ stock: 1 }).exec();

    } catch (err) {
        res.redirect('/category/labels');
    }

    res.render('./label/label_detail', {
        label: label,
        label_albums: allAlbumsByLabel,
        label_formats: allFormatsByLabel,
    });
});

exports.label_create_get = asyncHandler(async (req, res, next) => {
    res.render('./label/label_form', {
        title: 'Add Label',
        label: undefined,
        errors: undefined
    });
});

exports.label_create_post = [
    body('name', 'Name must be specified.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('founded')
        .trim()
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const label = new Label({
            name: req.body.name,
            founded: req.body.founded,
        });

        if (!errors.isEmpty()) {
            console.log(label)
            res.render('./label/label_form', {
                title: 'Add Label',
                label: label,
                errors: errors.array(),
            });
        } else {
            await label.save();
            res.redirect(label.url);
        }
    }),
];

exports.label_delete_get = asyncHandler(async (req, res, next) => {
    let label, allAlbumsByLabel;
    try {
        [label, allAlbumsByLabel] = await Promise.all([
            Label.findById(req.params.id).exec(),
            Album.find({ label: req.params.id }).exec(),
        ]);
    } catch (err) {
        res.redirect('/category/labels');
    }

    res.render('./label/label_delete', {
        label: label,
        label_albums: allAlbumsByLabel,
    });
});

exports.label_delete_post = asyncHandler(async (req, res, next) => {
    const [label, allAlbumsByLabel] = await Promise.all([
        Label.findById(req.params.id).exec(),
        Album.find({ label: req.params.id }).exec(),
    ]);

    if (allAlbumsByLabel.length > 0) {
        res.render('./label/label_delete', {
            label: label,
            label_albums: allAlbumsByLabel,
        });
        return;
    } else {
        await Label.findByIdAndDelete(req.params.id);
        res.redirect('/category/labels');
    }
});

exports.label_update_get = asyncHandler(async (req, res, next) => {
    let label;
    try {
        label = await Label.findById(req.params.id).exec();
    } catch (err) {
        res.redirect('/category/labels');
    }

    res.render('./label/label_form', {
        title: 'Update Label',
        label: label,
        errors: undefined,
    });
});

exports.label_update_post = [
    body('name', 'Label name must contain at least 1 character.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('founded')
        .trim()
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        console.log(req.body)

        const label = new Label({
            name: req.body.name,
            founded: req.body.founded,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            console.log(label)
            res.render('./label/label_form', {
                title: 'Update Label',
                label: label,
                errors: errors.array(),
            });
        } else {
            const updatedLabel = await Label.findByIdAndUpdate(req.params.id, label, {});
            res.redirect(updatedLabel.url);
        }
    }),
];
