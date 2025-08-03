

const express = require('express');
const { newAlbum, getAllAlbumsByUser, editAlbumByUser } = require('../../controller/Gallery/album.controller');
const { asyncHandler } = require('../../utils/async/asyncHandler');
const { authenticate } = require('../../middleware/token');
const r= express.Router();
r.use(authenticate)
r.post('/', asyncHandler(newAlbum));
r.get('/', asyncHandler(getAllAlbumsByUser));
r.patch('/:albumId', asyncHandler(editAlbumByUser));

module.exports = r;