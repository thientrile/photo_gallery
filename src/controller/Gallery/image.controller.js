const { uploadImages, getImageById, getAllImagesByUserId, getAllImagesByAlbumId, deleteImageById, addImageToAlbum, removeImageFromAlbum, addMultipleImagesToAlbum, removeMultipleImagesFromAlbum } = require("../../service/image.service");
const { SuccessResponse } = require("../../utils/handRespones/success.response");
const { BadRequestError } = require("../../utils/handRespones/error.response");


const uploadImage = async (req, res) => {
    const { files } = req;
    req.body.files = files;
    
    if (!files || files.length === 0) {
        throw new BadRequestError('Please upload at least one image');
    }

    // Log upload info
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    console.log(`📤 Starting upload: ${files.length} files, ${Math.round(totalSize/1024/1024)}MB total`);

    const startTime = Date.now();
    const result = await uploadImages(req.decoded.userId, req.body);
    const uploadTime = Date.now() - startTime;

    console.log(`✅ Upload completed in ${uploadTime}ms`);

    new SuccessResponse({
        message: `Successfully uploaded ${result.length} image(s)`,
        metadata: {
            images: result,
            uploadStats: {
                totalFiles: files.length,
                uploadTime: `${uploadTime}ms`,
                totalSize: `${Math.round(totalSize/1024/1024)}MB`
            }
        }
    }).send(res);
}

// Optimized upload với real-time progress (for WebSocket future implementation)
const uploadImageOptimized = async (req, res) => {
    const { files } = req;
    req.body.files = files;
    
    if (!files || files.length === 0) {
        throw new BadRequestError('Please upload at least one image');
    }

    // Check file sizes và recommendations
    const largeFiles = files.filter(f => (f.size || 0) > 50 * 1024 * 1024);
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    
    let recommendations = [];
    if (largeFiles.length > 0) {
        recommendations.push(`${largeFiles.length} file(s) are very large (>50MB). Consider compressing before upload.`);
    }
    if (totalSize > 200 * 1024 * 1024) {
        recommendations.push('Total size >200MB. Upload may take several minutes.');
    }

    console.log(`📊 Upload analysis: ${files.length} files, ${Math.round(totalSize/1024/1024)}MB, ${largeFiles.length} large files`);

    const startTime = Date.now();
    const result = await uploadImages(req.decoded.userId, req.body);
    const uploadTime = Date.now() - startTime;

    new SuccessResponse({
        message: `Successfully uploaded ${result.length} image(s) with optimization`,
        metadata: {
            images: result,
            uploadStats: {
                totalFiles: files.length,
                successfulUploads: result.length,
                uploadTime: `${uploadTime}ms`,
                totalSize: `${Math.round(totalSize/1024/1024)}MB`,
                averageTimePerFile: `${Math.round(uploadTime/files.length)}ms`,
                recommendations
            }
        }
    }).send(res);
}
const getImage = async (req, res) => {
    const { imageId } = req.params;
    const image = await getImageById(imageId);
    new SuccessResponse({
        message: 'Image retrieved successfully',
        metadata: image
    }).send(res);
}
const getAllImage = async (req, res) => {
    const { search } = req.query; // Lấy query parameter search
    const images = await getAllImagesByUserId(req.decoded.userId, search);

    new SuccessResponse({
        message: search ? `Images found for "${search}"` : 'All images retrieved successfully',
        metadata: {
            searchQuery: search || null,
            totalFound: images.length,
            images: images
        }
    }).send(res);
}
const getAllImageByAlbumId = async (req, res) => {
    const { albumId } = req.params;
    const images = await getAllImagesByAlbumId(albumId);
    new SuccessResponse({
        message: 'All images in album retrieved successfully',
        metadata: images
    }).send(res);
}

const DeleteImageById = async (req, res) => {
    const { imageId } = req.params;
    const userId = req.decoded.userId;
    const deletedImage = await deleteImageById(imageId, userId);
    new SuccessResponse({
        message: 'Image deleted successfully',
        metadata: deletedImage
    }).send(res);
}

// Thêm ảnh vào album
const addToAlbum = async (req, res) => {
    const { imageId } = req.params;
    const { albumId } = req.body;
    const userId = req.decoded.userId;

    if (!albumId) {
        throw new BadRequestError('Album ID is required');
    }

    const result = await addImageToAlbum(imageId, albumId, userId);
    
    new SuccessResponse({
        message: result.message,
        metadata: result
    }).send(res);
};

// Xóa ảnh khỏi album
const removeFromAlbum = async (req, res) => {
    const { imageId } = req.params;
    const userId = req.decoded.userId;

    const result = await removeImageFromAlbum(imageId, userId);
    
    new SuccessResponse({
        message: result.message,
        metadata: result
    }).send(res);
};

// Thêm nhiều ảnh vào album
const addMultipleToAlbum = async (req, res) => {
    const { imageIds, albumId } = req.body;
    const userId = req.decoded.userId;

    if (!albumId) {
        throw new BadRequestError('Album ID is required');
    }

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        throw new BadRequestError('Image IDs array is required and must not be empty');
    }

    const result = await addMultipleImagesToAlbum(imageIds, albumId, userId);
    
    new SuccessResponse({
        message: result.message,
        metadata: result
    }).send(res);
};

// Xóa nhiều ảnh khỏi album
const removeMultipleFromAlbum = async (req, res) => {
    const { imageIds } = req.body;
    const userId = req.decoded.userId;

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        throw new BadRequestError('Image IDs array is required and must not be empty');
    }

    const result = await removeMultipleImagesFromAlbum(imageIds, userId);
    
    new SuccessResponse({
        message: result.message,
        metadata: result
    }).send(res);
};

module.exports = {
    getAllImageByAlbumId,
    uploadImage,
    uploadImageOptimized,
    getImage,
    DeleteImageById,
    getAllImage,
    addToAlbum,
    removeFromAlbum,
    addMultipleToAlbum,
    removeMultipleFromAlbum
};