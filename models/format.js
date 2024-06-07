const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FormatSchema = new Schema({
    album: { type: Schema.Types.ObjectId, ref: "Album", required: true },
    format: {
        type: String,
        required: true,
        enum: ['CD', 'Vinyl', 'Cassette', 'Digital'],
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    barcode: { type: String, required: true },
    image: { type: String, maxLength: 100 },
});

FormatSchema.virtual('price_formatted').get(function () {
    return (this.price / 100).toFixed(2);
})

FormatSchema.virtual('url').get(function () {
    return `/release/${this._id}`;
});

module.exports = mongoose.model('Format', FormatSchema);

