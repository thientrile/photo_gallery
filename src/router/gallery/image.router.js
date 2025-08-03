



const express = require('express');
const { asyncHandler } = require('../../utils/async/asyncHandler');
const { uploadImage, getImage, getAllImage, getAllImageByAlbumId, DeleteImageById } = require('../../controller/Gallery/image.controller');
const { updloadMemory } = require('../../utils/multer/multer');
const { authenticate } = require('../../middleware/token');
const r = express.Router();
r.use(authenticate)
r.post('/upload', updloadMemory.array('files', 100), asyncHandler(uploadImage))
r.get('/:imageId',asyncHandler(getImage))
r.delete('/:imageId',asyncHandler(DeleteImageById))
r.get('/', asyncHandler(getAllImage));
r.get('/album/:albumId', asyncHandler(getAllImageByAlbumId));
module.exports = r;