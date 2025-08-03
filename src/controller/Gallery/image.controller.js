const { uploadImages, getImageById, getAllImagesByUserId, getAllImagesByAlbumId, deleteImageById } = require("../../service/image.service");
const { SuccessResponse } = require("../../utils/handRespones/success.response");


const uploadImage = async (req, res) => {
    const { files } = req;
    req.body.files = files;
    if (!files) {
        throw new BadRequestError('Please upload an image');
    }
    new SuccessResponse({
        message: 'Image uploaded successfully',
        metadata: await uploadImages(req.decoded.userId, req.body)
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
    const images = await getAllImagesByUserId(req.decoded.userId);

    new SuccessResponse({
        message: 'All images retrieved successfully',
        metadata: images
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
module.exports = {
    getAllImageByAlbumId,
    uploadImage,
    getImage,
    DeleteImageById,

    getAllImage
};