const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    release_date: { type: Date, required: true },
    label: { type: Schema.Types.ObjectId, ref: 'Label', required: true },
    genre: { type: Schema.Types.ObjectId, ref: "Genre" },
    image: { type: String, maxLength: 100 },
});

AlbumSchema.virtual('release_date_formatted').get(function () {
    const year = DateTime.fromJSDate(this.release_date).toObject();
    return year.year;
});

AlbumSchema.virtual('release_dd_mm_yyyy').get(function () {
    return  DateTime.fromJSDate(this.release_date).toISODate();
});

AlbumSchema.virtual('url').get(function () {
    return `/album/${this._id}`;
});

module.exports = mongoose.model('Album', AlbumSchema);