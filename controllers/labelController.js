const Label = require('../models/label');
const Album = require('../models/album');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.label_list = asyncHandler(async (req, res, next) => {
    const allLabels = await Label.find().sort({ name: 1 }).exec();

    res.render('label_list', {
        title: 'All Labels',
        labels: allLabels,
    });
});

exports.label_detail = asyncHandler(async (req, res, next) => {
    const [label, allAlbumsByLabel] = await Promise.all([
        Label.findById(req.params.id),
        Album.find({ label: req.params.id }),
    ]);

    if (label === null) {
        const err = new Error('Label not found');
        err.status = 404;
        return next(err);
    }

    res.render('label_detail', {
        label: label,
        label_albums: allAlbumsByLabel,
    });
});

exports.label_create_get = asyncHandler(async (req, res, next) => {
    res.render('label_form', { title: 'Add Label', label: undefined });
});

exports.label_create_post = [
    body('name', 'Label name must contain at least 1 character.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('founded', "Founded must not be empty")
        .trim()
        .isLength({ min: 4 })
        .isNumeric()
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        console.log(req.body)

        const label = new Label({
            name: req.body.name,
            founded: req.body.founded,
        });

        if (!errors.isEmpty()) {
            console.log(label)
            res.render('label_form', {
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
    res.send("NOT IMPLEMENTED");
});

exports.label_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.label_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});

exports.label_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
});