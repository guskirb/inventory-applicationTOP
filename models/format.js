const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FormatSchema = new Schema({
    album: { type: Schema.Types.ObjectId, ref: "Album", required: true },
    format: {
        type: String,
        required: true,
        enum: ['CD', 'Vinyl', 'Cassette Tape', 'Digital'],
    },
    stock: { type: Number, required: true },
    barcode: { type: String, required: true },
});

FormatSchema.virtual('url').get(function () {
    return `/category/format/${this._id}`;
});

module.exports = mongoose.model('Format', FormatSchema);

