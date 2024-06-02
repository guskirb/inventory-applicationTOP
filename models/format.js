const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FormatSchema = new Schema({
    album: { type: Schema.Types.ObjectId, ref: "Album", required: true },
    format: {
        type: String,
        required: true,
        enum: ['CD', 'Vinyl', 'Cassette Tape', 'Digital'],
    },
<<<<<<< HEAD
    price: { type: Number, required: true },
=======
>>>>>>> 910785365f58a6a8324c45e08eba756b97c903a0
    stock: { type: Number, required: true },
    barcode: { type: String, required: true },
});

<<<<<<< HEAD
FormatSchema.virtual('price_formatted').get(function () {
    return (this.price / 100).toFixed(2);
})

=======
>>>>>>> 910785365f58a6a8324c45e08eba756b97c903a0
FormatSchema.virtual('url').get(function () {
    return `/category/format/${this._id}`;
});

module.exports = mongoose.model('Format', FormatSchema);

