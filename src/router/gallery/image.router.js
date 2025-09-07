



const express = require('express');
const { asyncHandler } = require('../../utils/async/asyncHandler');
const { uploadImage, uploadImageOptimized, getImage, getAllImage, getAllImageByAlbumId, DeleteImageById, addToAlbum, removeFromAlbum, addMultipleToAlbum, removeMultipleFromAlbum, toggleFavorite, getFavorites, addMultipleFavorites, removeMultipleFavorites } = require('../../controller/Gallery/image.controller');
const { updloadMemory, hybridUpload } = require('../../utils/multer/multer');
const { authenticate } = require('../../middleware/token');
const { validateParams, validateQuery, validateSchema, favoriteImageParamsSchema, favoriteImagesQuerySchema, bulkFavoriteImagesSchema } = require('../../utils/validate/joi');
const r = express.Router();

// Routes cần authenticate
r.use(authenticate);

// Upload và quản lý ảnh với optimized handling
r.post('/upload', hybridUpload, asyncHandler(uploadImage));
r.post('/upload/optimized', hybridUpload, asyncHandler(uploadImageOptimized)); // Enhanced upload với detailed stats
r.post('/upload/standard', updloadMemory.array('files', 100), asyncHandler(uploadImage)); // Fallback route
r.get('/:imageId', asyncHandler(getImage));
r.delete('/:imageId', asyncHandler(DeleteImageById));
r.get('/', asyncHandler(getAllImage)); // Hỗ trợ ?search=query
r.get('/album/:albumId', asyncHandler(getAllImageByAlbumId));

// Quản lý ảnh trong album
r.post('/:imageId/add-to-album', asyncHandler(addToAlbum)); // Body: { "albumId": 123 }
r.delete('/:imageId/remove-from-album', asyncHandler(removeFromAlbum));

// Quản lý nhiều ảnh trong album
r.post('/bulk/add-to-album', asyncHandler(addMultipleToAlbum)); // Body: { "imageIds": [1,2,3], "albumId": 123 }
r.post('/bulk/remove-from-album', asyncHandler(removeMultipleFromAlbum)); // Body: { "imageIds": [1,2,3] }

// Quản lý ảnh yêu thích
r.post('/:imageId/toggle-favorite', validateParams(favoriteImageParamsSchema), asyncHandler(toggleFavorite)); // Toggle trạng thái yêu thích
r.get('/favorites/list', validateQuery(favoriteImagesQuerySchema), asyncHandler(getFavorites)); // Lấy danh sách ảnh yêu thích (có pagination)
r.post('/favorites/add-multiple', validateSchema(bulkFavoriteImagesSchema), asyncHandler(addMultipleFavorites)); // Body: { "imageIds": [1,2,3] }
r.post('/favorites/remove-multiple', validateSchema(bulkFavoriteImagesSchema), asyncHandler(removeMultipleFavorites)); // Body: { "imageIds": [1,2,3] }

module.exports = r;