const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, maxLength: 100 },
    birth_date: { type: Date },
    death_date: { type: Date },
    country: { type: String, maxLength: 100 },
});

ArtistSchema.virtual('name').get(function () {
    if (this.first_name && this.last_name) {
        return `${this.first_name} ${this.last_name}`
    } else {
        return this.first_name;
    }
});

ArtistSchema.virtual('lifespan').get(function () {
    if (this.birth_date && this.death_date) {
        return `Born: ${DateTime.fromJSDate(this.birth_date).toLocaleString(DateTime.DATE_MED)}, Died: ${DateTime.fromJSDate(this.death_date).toLocaleString(DateTime.DATE_MED)}`;
    } else {
        `Born: ${DateTime.fromJSDate(this.birth_date).toLocaleString(DateTime.DATE_MED)}`;
    }
});

ArtistSchema.virtual('url').get(function () {
    return `/category/artist/${this._id}`;
});

module.exports = mongoose.model('Artist', ArtistSchema);