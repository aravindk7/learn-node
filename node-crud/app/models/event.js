const mongoose = require('mongoose');
const schema = mongoose.Schema;

//create a schema
const eventSchema = new mongoose.Schema({
    name: String,
    slug: {
        type: String,
        unique: true
    },
    description: String
});

//middleware
eventSchema.pre('save', function(next) {
    this.slug = slugify(this.name);
    next();
});

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replaces spaces with -
        .replace(/[^\w\-]+/g, '') // Replaces all non-word characters
        .replace(/\-\-+/g, '-') // Replaces multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};

//create a model
const eventModel = mongoose.model('Event', eventSchema);

//export the model
module.exports = eventModel;