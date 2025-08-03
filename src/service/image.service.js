
const { outputImages } = require('../dto/images');
const albumModel = require('../model/album.model');
const { ImageModel } = require('../model/image.model');
const { randomId, convertToObjectIdMongoose, omitInfoData, removePrefixFromKeys } = require('../utils');
const { streamUpload } = require('../utils/cloudinary/utils');
const { BadRequestError } = require('../utils/handRespones/error.response');
const cloudinary = require('../utils/cloudinary/cloudinary');

const uploadImages = async (userId, payload) => {
    const { files, tags = [], caption = '', albumId } = payload;
    const findAlbum = await albumModel.findOne({ alb_id: albumId }).lean();
    if (!files?.length) {
        throw new BadRequestError('No images found in request');
    }
    try {
        // 1. Upload all images to Cloudinary
        const uploadResults = await Promise.all(
            files.map((file) =>
                streamUpload(
                    file.buffer,
                    randomId(),
                    `photo_gallery/${userId}/images`,
                    tags
                )
            )
        );

        // 2. Save uploaded image data to DB
        const newImages = uploadResults.map((result) => ({
            img_uploaderId: convertToObjectIdMongoose(userId),
            img_albumId: findAlbum ? findAlbum._id : null, // hoặc payload.albumId nếu có
            img_url: result.url,
            img_secureUrl: result.secure_url,
            img_publicId: result.public_id,
            img_format: result.format,
            img_width: result.width,
            img_height: result.height,
            img_bytes: result.bytes,
            img_tags: result.tags || tags,
            img_caption: caption,
        }));

        const images = await ImageModel.insertMany(newImages); // tối ưu hơn create + Promise.all
        return images.map((img) => omitInfoData({ fields: outputImages, object: removePrefixFromKeys(img.toObject(), 'img_') }));

    } catch (err) {
        console.error('❌ Upload error:', err);
        throw new BadRequestError('Failed to upload one or more images');
    }
};
const getImageById = async (imageId) => {
    const image = await ImageModel.findOne({ img_id: imageId }).lean();
    if (!image) {
        throw new BadRequestError('Image not found');
    }
    return omitInfoData({ fields: outputImages, object: removePrefixFromKeys(image, 'img_') });
}
const getAllImagesByUserId = async (userId) => {
    const images = await ImageModel.find({ img_uploaderId: convertToObjectIdMongoose(userId) }).lean();
    return images.map((img) => omitInfoData({ fields: outputImages, object: removePrefixFromKeys(img, 'img_') }));
}
const getAllImagesByAlbumId = async (albumId) => {
    const findAlbum = await albumModel.findOne({ alb_id: albumId }).lean();
    if (!findAlbum) {
        throw new BadRequestError('Album not found');
    }
    const images = await ImageModel.find({ img_albumId: findAlbum._id }).lean();
    return images.map((img) => omitInfoData({ fields: outputImages, object: removePrefixFromKeys(img, 'img_') }));
}

const deleteImageById = async (imgId, userId) => {
  try {
    // Tìm ảnh trước
    const image = await ImageModel.findOne({
      img_id: imgId,
      img_uploaderId: convertToObjectIdMongoose(userId),
    });

    if (!image) {
      throw new Error('Không tìm thấy ảnh hoặc không thuộc quyền sở hữu');
    }

    // Xoá trên Cloudinary
    const cloudResult = await cloudinary.uploader.destroy(image.img_publicId);
    if (cloudResult.result !== 'ok' && cloudResult.result !== 'not found') {
      throw new Error('Xoá ảnh Cloudinary thất bại');
    }

    // Xoá trong MongoDB
    await ImageModel.deleteOne({ _id: image._id });

    return { success: true, message: 'Ảnh đã bị xoá khỏi hệ thống' };
  } catch (error) {
    console.error('🔥 Lỗi xoá ảnh:', error.message);
    return { success: false, message: error.message };
  }
};

module.exports = {
    uploadImages,
    getImageById,
    getAllImagesByUserId,
    getAllImagesByAlbumId,
    deleteImageById
};