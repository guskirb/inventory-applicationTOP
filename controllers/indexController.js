const asyncHandler = require('express-async-handler');
const Album = require('../models/album');
const Artist = require('../models/artist');
const Format = require('../models/format');

exports.index = asyncHandler(async (req, res, next) => {
    const [allAlbums, allFormats] = await Promise.all([
        Album.countDocuments({}).exec(),
        Format.aggregate([
            {
                $group: {
                    _id: null,
                    stock: { $sum: "$stock" },
                    low_stock: { $sum: { $cond: [{ $lte: ['$stock', 5] }, 1, 0] } },
                }
            },
        ]).exec(),
    ]);

    res.render('index', {
        title: 'Dashboard',
        albums: allAlbums,
        formats: allFormats,
    })
});

exports.search = asyncHandler(async (req, res, next) => {
    const search = req.query.search.replace(/\\/g, "\\\\");

    const artists = await Artist.find(
        {
            $or:
                [{ "first_name": { $regex: search, "$options": "i" } },
                { "last_name": { $regex: search, "$options": "i" } }]
        }).exec();
    const albums = await Album.find(
        {
            $or:
                [{ "title": { $regex: search, "$options": "i" } },
                { "artist": artists }],
        }).populate('artist').exec();
    const formats = await Format.find({ album: albums }).populate({
        path: 'album',
        select: 'title',
        options: { sort: { "title": 1 } },
        populate: {
            path: 'artist',
            model: 'Artist',
        },
    }).exec();

    res.render('search_results', {
        title: `${search} - Search`,
        artists: artists,
        albums: albums,
        formats: formats,
    });
});