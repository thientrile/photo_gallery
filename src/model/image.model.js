"use strict";
const DOCUMENT_NAME = 'Image';
const COLLECTION_NAME = 'Images';



const { Schema, model, Types } = require('mongoose');
const { randomId } = require('../utils');

const imageSchema = new Schema(
    {
        img_uploaderId: {
            type: Types.ObjectId, // user đã upload
            ref: 'User',
            required: true,
        },
        img_albumId: {
            type: Types.ObjectId, // nếu ảnh thuộc album nào đó
            ref: 'Album',
            default: null,
        },
        img_id: {
            type: Number,
            default: () => randomId(),
        },
        img_url: {
            type: String,
            required: true, // link CDN ảnh gốc
        },
        img_secureUrl: {
            type: String,// link HTTPS an toàn (từ Cloudinary)
        },
        img_publicId: {
            type: String, // ID nội bộ của Cloudinary, để xoá/sửa
            required: true,
            unique: true,
        },
        img_format: {
            type: String, // png, gif, webp, ...
        },
        img_width: {
            type: Number,
        },
        img_height: {
            type: Number,
        },
        img_bytes: {
            type: Number,
        }, // dung lượng

        img_tags: {
            type: [String],
            default: [],
        },
        img_caption: {
            type: String,// "Ảnh chụp ở Hồ Xuân Hương",
            maxlength: 500,
        },
        img_isPublic: {
            type: Boolean,
            default: false,
        },

        img_isLove:{
            type: Boolean,
            default: false,
        }

        // img_location: {
        //     lat: Number,
        //     lng: Number,
        //     placeName: String,
        // },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true, // auto add createdAt & updatedAt
    }
);
;

const ImageModel = model(DOCUMENT_NAME, imageSchema);

module.exports = {
    ImageModel
};