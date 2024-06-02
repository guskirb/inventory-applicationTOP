const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const LabelSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    founded: { type: Date },
});

LabelSchema.virtual('url').get(function () {
    return `/label/${this._id}`;
});

module.exports = mongoose.model('Label', LabelSchema);