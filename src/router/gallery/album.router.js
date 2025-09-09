

const express = require('express');
const { newAlbum, getAllAlbumsByUser, editAlbumByUser, deleteAlbum } = require('../../controller/Gallery/album.controller');
const { asyncHandler } = require('../../utils/async/asyncHandler');
const { authenticate } = require('../../middleware/token');
const { validateParams } = require('../../utils/validate/joi');
const Joi = require('joi');

const r = express.Router();

// Joi schema cho validation albumId
const albumIdParamsSchema = Joi.object({
    albumId: Joi.number().integer().positive().required().messages({
        'number.base': 'Album ID phải là số',
        'number.integer': 'Album ID phải là số nguyên',
        'number.positive': 'Album ID phải là số dương',
        'any.required': 'Album ID là bắt buộc'
    })
});

r.use(authenticate);
r.post('/', asyncHandler(newAlbum));
r.get('/', asyncHandler(getAllAlbumsByUser));
r.patch('/:albumId', validateParams(albumIdParamsSchema), asyncHandler(editAlbumByUser));
r.delete('/:albumId', validateParams(albumIdParamsSchema), asyncHandler(deleteAlbum));

module.exports = r;