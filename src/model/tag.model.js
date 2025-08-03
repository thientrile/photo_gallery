

const DOCUMENT_NAME = 'Tag';
const COLLECTION_NAME = 'Tags';
const { randomId } = require('../utils/index');


const { Schema, model } = require('mongoose');

const tagSchema = new Schema({
    tag_id: { type: Number, default: () => randomId() },
    tag_name: { type: String, required: true},
    tag_createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, tagSchema);