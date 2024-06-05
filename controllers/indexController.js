const asyncHandler = require('express-async-handler');
const Album = require('../models/album');
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
    console.log(allFormats)
    res.render('index', {
        title: 'Music Inventory',
        albums: allAlbums,
        formats: allFormats,
    })
});