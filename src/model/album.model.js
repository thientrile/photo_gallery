

const DOCUMENT_NAME = 'Album';
const COLLECTION_NAME = 'Albums';
// const { randomId } = require('../utils/index.js');
const { Schema, model } = require('mongoose');
const { randomId } = require('../utils');

const albumSchema = new Schema({
    alb_id: { type: Number, default: () => randomId() },
    alb_title: { type: String, required: true },
    alb_description: { type: String, default: '' },
    alb_cover_image: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
    },
    alb_userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    alb_isPublic: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, albumSchema);