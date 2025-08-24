
const { outputImages } = require('../dto/images');
const albumModel = require('../model/album.model');
const { ImageModel } = require('../model/image.model');
const { randomId, convertToObjectIdMongoose, omitInfoData, removePrefixFromKeys } = require('../utils');
const { streamUpload, optimizedUpload, batchUpload, uploadWithProgress } = require('../utils/cloudinary/utils');
const { BadRequestError } = require('../utils/handRespones/error.response');
const cloudinary = require('../utils/cloudinary/cloudinary');

const uploadImages = async (userId, payload) => {
    const { files, tags = [], caption = '', albumId } = payload;
    console.log("🚀 ~ uploadImages ~ files count:", files?.length);
    
    const findAlbum = await albumModel.findOne({ alb_id: albumId }).lean();
    if (!files?.length) {
        throw new BadRequestError('No images found in request');
    }

    // Calculate total size để chọn strategy
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const averageSize = totalSize / files.length;
    const isLargeUpload = totalSize > 100 * 1024 * 1024; // 100MB total
    const hasLargeFiles = files.some(file => (file.size || 0) > 50 * 1024 * 1024); // 50MB per file

    console.log(`📊 Upload stats: ${files.length} files, ${Math.round(totalSize/1024/1024)}MB total, ${Math.round(averageSize/1024/1024)}MB average`);

    try {
        let uploadResults;

        if (isLargeUpload || hasLargeFiles) {
            // Use optimized batch upload for large files
            console.log('🚀 Using optimized batch upload for large files');
            
            const batchResult = await batchUpload(
                files, 
                `photo_gallery/${userId}/images`,
                tags,
                {
                    concurrency: hasLargeFiles ? 2 : 3, // Reduce concurrency for very large files
                    compress: true,
                    onProgress: (completed, total, result) => {
                        console.log(`📤 Progress: ${completed}/${total} files uploaded`);
                    }
                }
            );

            if (batchResult.errors.length > 0) {
                console.warn('⚠️ Some files failed to upload:', batchResult.errors);
            }

            uploadResults = batchResult.results;
            
            if (uploadResults.length === 0) {
                throw new BadRequestError('All files failed to upload');
            }
        } else {
            // Use standard Promise.all for smaller files
            console.log('💨 Using standard parallel upload for small files');
            
            uploadResults = await Promise.all(
                files.map(async (file, index) => {
                    try {
                        const publicId = randomId();
                        const input = file.buffer || file.path;
                        
                        return await optimizedUpload(
                            input,
                            publicId,
                            `photo_gallery/${userId}/images`,
                            tags,
                            { compress: true, quality: 85 }
                        );
                    } catch (error) {
                        console.error(`❌ Failed to upload file ${index}:`, error.message);
                        throw error;
                    }
                })
            );
        }

        // 2. Save uploaded image data to DB
        const newImages = uploadResults.map((result) => ({
            img_uploaderId: convertToObjectIdMongoose(userId),
            img_albumId: findAlbum ? findAlbum._id : null,
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

        console.log(`💾 Saving ${newImages.length} images to database`);
        const images = await ImageModel.insertMany(newImages);
        
        const processedImages = images.map((img) => 
            omitInfoData({ 
                fields: outputImages, 
                object: removePrefixFromKeys(img.toObject(), 'img_') 
            })
        );

        console.log(`✅ Successfully uploaded and saved ${processedImages.length} images`);
        return processedImages;

    } catch (err) {
        console.error('❌ Upload error:', err);
        
        // Enhanced error reporting
        if (err.message.includes('timeout')) {
            throw new BadRequestError('Upload timeout - files too large or connection too slow');
        } else if (err.message.includes('Invalid image')) {
            throw new BadRequestError('Invalid image format or corrupted file');
        } else if (err.message.includes('File too large')) {
            throw new BadRequestError('File size exceeds limit (500MB per file)');
        }
        
        throw new BadRequestError(`Upload failed: ${err.message}`);
    }
};
const getImageById = async (imageId) => {
    const image = await ImageModel.findOne({ img_id: imageId }).lean();
    if (!image) {
        throw new BadRequestError('Image not found');
    }
    return omitInfoData({ fields: outputImages, object: removePrefixFromKeys(image, 'img_') });
}
const getAllImagesByUserId = async (userId, searchQuery = null) => {
    try {
        // Base query - lấy ảnh của user
        let query = { img_uploaderId: convertToObjectIdMongoose(userId) };
        
        // Nếu có search query, tìm kiếm theo cả tags và album name
        if (searchQuery && searchQuery.trim()) {
            const searchTerm = searchQuery.trim();
            
            // Tìm albums có tên chứa search term
            const matchingAlbums = await albumModel.find({
                alb_userId: convertToObjectIdMongoose(userId),
                alb_title: { $regex: searchTerm, $options: 'i' }
            }).lean();
            
            const albumIds = matchingAlbums.map(album => album._id);
            
            // Tạo query tìm kiếm kết hợp
            query = {
                img_uploaderId: convertToObjectIdMongoose(userId),
                $or: [
                    // Tìm theo tags (không phân biệt hoa thường)
                    { img_tags: { $regex: searchTerm, $options: 'i' } },
                    // Tìm theo album IDs
                    { img_albumId: { $in: albumIds } }
                ]
            };
        }
        
        const images = await ImageModel.find(query)
            .populate('img_albumId', 'alb_title alb_id')
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
            .lean();

        return images.map((img) => {
            const imageData = omitInfoData({ 
                fields: outputImages, 
                object: removePrefixFromKeys(img, 'img_') 
            });
            
            // Thêm thông tin album nếu có
            if (img.img_albumId) {
                imageData.album = {
                    id: img.img_albumId.alb_id,
                    title: img.img_albumId.alb_title
                };
            }
            
            return imageData;
        });
    } catch (error) {
        console.error('❌ Get all images error:', error);
        throw new BadRequestError('Failed to get images');
    }
};
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

// Thêm ảnh vào album
const addImageToAlbum = async (imageId, albumId, userId) => {
  try {
    // Kiểm tra ảnh có tồn tại và thuộc về user này không
    const image = await ImageModel.findOne({
      img_id: imageId,
      img_uploaderId: convertToObjectIdMongoose(userId)
    });

    if (!image) {
      throw new BadRequestError('Ảnh không tồn tại hoặc không thuộc quyền sở hữu');
    }

    // Kiểm tra album có tồn tại và thuộc về user này không
    const album = await albumModel.findOne({
      alb_id: albumId,
      alb_userId: convertToObjectIdMongoose(userId)
    });

    if (!album) {
      throw new BadRequestError('Album không tồn tại hoặc không thuộc quyền sở hữu');
    }

    // Kiểm tra ảnh đã có trong album này chưa
    if (image.img_albumId && image.img_albumId.toString() === album._id.toString()) {
      throw new BadRequestError('Ảnh đã có trong album này rồi');
    }

    // Cập nhật ảnh để thêm vào album
    const updatedImage = await ImageModel.findByIdAndUpdate(
      image._id,
      { img_albumId: album._id },
      { new: true }
    ).populate('img_albumId', 'alb_title alb_id').lean();

    const imageData = omitInfoData({ 
      fields: outputImages, 
      object: removePrefixFromKeys(updatedImage, 'img_') 
    });

    // Thêm thông tin album
    if (updatedImage.img_albumId) {
      imageData.album = {
        id: updatedImage.img_albumId.alb_id,
        title: updatedImage.img_albumId.alb_title
      };
    }

    return {
      success: true,
      message: `Ảnh đã được thêm vào album "${album.alb_title}"`,
      image: imageData
    };
  } catch (error) {
    console.error('❌ Add image to album error:', error);
    throw error instanceof BadRequestError ? error : new BadRequestError('Không thể thêm ảnh vào album');
  }
};

// Xóa ảnh khỏi album (chỉ xóa khỏi album, không xóa ảnh)
const removeImageFromAlbum = async (imageId, userId) => {
  try {
    // Kiểm tra ảnh có tồn tại và thuộc về user này không
    const image = await ImageModel.findOne({
      img_id: imageId,
      img_uploaderId: convertToObjectIdMongoose(userId)
    }).populate('img_albumId', 'alb_title alb_id');

    if (!image) {
      throw new BadRequestError('Ảnh không tồn tại hoặc không thuộc quyền sở hữu');
    }

    // Kiểm tra ảnh có trong album nào không
    if (!image.img_albumId) {
      throw new BadRequestError('Ảnh không thuộc album nào');
    }

    const albumTitle = image.img_albumId.alb_title;

    // Xóa ảnh khỏi album (set albumId = null)
    const updatedImage = await ImageModel.findByIdAndUpdate(
      image._id,
      { img_albumId: null },
      { new: true }
    ).lean();

    const imageData = omitInfoData({ 
      fields: outputImages, 
      object: removePrefixFromKeys(updatedImage, 'img_') 
    });

    return {
      success: true,
      message: `Ảnh đã được xóa khỏi album "${albumTitle}"`,
      image: imageData
    };
  } catch (error) {
    console.error('❌ Remove image from album error:', error);
    throw error instanceof BadRequestError ? error : new BadRequestError('Không thể xóa ảnh khỏi album');
  }
};

// Thêm nhiều ảnh vào album cùng lúc
const addMultipleImagesToAlbum = async (imageIds, albumId, userId) => {
  try {
    // Kiểm tra album có tồn tại và thuộc về user này không
    const album = await albumModel.findOne({
      alb_id: albumId,
      alb_userId: convertToObjectIdMongoose(userId)
    });

    if (!album) {
      throw new BadRequestError('Album không tồn tại hoặc không thuộc quyền sở hữu');
    }

    // Lấy tất cả ảnh thuộc về user và có trong danh sách imageIds
    const images = await ImageModel.find({
      img_id: { $in: imageIds },
      img_uploaderId: convertToObjectIdMongoose(userId)
    });

    if (!images.length) {
      throw new BadRequestError('Không tìm thấy ảnh nào thuộc quyền sở hữu');
    }

    // Lọc ra những ảnh chưa có trong album này
    const imagesToUpdate = images.filter(img => 
      !img.img_albumId || img.img_albumId.toString() !== album._id.toString()
    );

    if (!imagesToUpdate.length) {
      throw new BadRequestError('Tất cả ảnh đã có trong album này rồi');
    }

    // Cập nhật tất cả ảnh để thêm vào album
    await ImageModel.updateMany(
      { _id: { $in: imagesToUpdate.map(img => img._id) } },
      { img_albumId: album._id }
    );

    // Lấy lại ảnh đã cập nhật
    const updatedImages = await ImageModel.find({
      _id: { $in: imagesToUpdate.map(img => img._id) }
    }).populate('img_albumId', 'alb_title alb_id').lean();

    const imageData = updatedImages.map((img) => {
      const data = omitInfoData({ 
        fields: outputImages, 
        object: removePrefixFromKeys(img, 'img_') 
      });

      if (img.img_albumId) {
        data.album = {
          id: img.img_albumId.alb_id,
          title: img.img_albumId.alb_title
        };
      }

      return data;
    });

    return {
      success: true,
      message: `Đã thêm ${imagesToUpdate.length} ảnh vào album "${album.alb_title}"`,
      addedCount: imagesToUpdate.length,
      totalRequested: imageIds.length,
      images: imageData
    };
  } catch (error) {
    console.error('❌ Add multiple images to album error:', error);
    throw error instanceof BadRequestError ? error : new BadRequestError('Không thể thêm ảnh vào album');
  }
};

// Xóa nhiều ảnh khỏi album cùng lúc
const removeMultipleImagesFromAlbum = async (imageIds, userId) => {
  try {
    // Lấy tất cả ảnh thuộc về user, có trong danh sách imageIds và đang trong album
    const images = await ImageModel.find({
      img_id: { $in: imageIds },
      img_uploaderId: convertToObjectIdMongoose(userId),
      img_albumId: { $ne: null }
    }).populate('img_albumId', 'alb_title alb_id');

    if (!images.length) {
      throw new BadRequestError('Không tìm thấy ảnh nào trong album');
    }

    // Cập nhật tất cả ảnh để xóa khỏi album
    await ImageModel.updateMany(
      { _id: { $in: images.map(img => img._id) } },
      { img_albumId: null }
    );

    // Lấy lại ảnh đã cập nhật
    const updatedImages = await ImageModel.find({
      _id: { $in: images.map(img => img._id) }
    }).lean();

    const imageData = updatedImages.map((img) => 
      omitInfoData({ 
        fields: outputImages, 
        object: removePrefixFromKeys(img, 'img_') 
      })
    );

    return {
      success: true,
      message: `Đã xóa ${images.length} ảnh khỏi album`,
      removedCount: images.length,
      totalRequested: imageIds.length,
      images: imageData
    };
  } catch (error) {
    console.error('❌ Remove multiple images from album error:', error);
    throw error instanceof BadRequestError ? error : new BadRequestError('Không thể xóa ảnh khỏi album');
  }
};

module.exports = {
    uploadImages,
    getImageById,
    getAllImagesByUserId,
    getAllImagesByAlbumId,
    deleteImageById,
    addImageToAlbum,
    removeImageFromAlbum,
    addMultipleImagesToAlbum,
    removeMultipleImagesFromAlbum
};