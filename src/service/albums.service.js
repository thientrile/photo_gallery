const { outputAlbums } = require("../dto/albums");
const albumModel = require("../model/album.model");
const { ImageModel } = require("../model/image.model");
const { getAlbumByUserId } = require("../repository/album.repo");
const { addPrefixToKeys, convertToObjectIdMongoose, randomId, removePrefixFromKeys, omitInfoData } = require("../utils");





const createNewAbums = async (payload, userId) => {

    const { title, description, cover_image } = payload;
    let coverImage = null;
    if (cover_image) {
        coverImage = await ImageModel.findOne({ img_id: cover_image, img_uploaderId: convertToObjectIdMongoose(userId) });
    }
    const id = randomId();
    const data = {
        id,
        title,
        description,
        cover_image: coverImage ? coverImage._id : null,
        userId
    }
    const newAlbum = await albumModel.create(addPrefixToKeys(data, 'alb_'));
    const removePrefixAlbum = removePrefixFromKeys(newAlbum.toObject(), 'alb_');
    return omitInfoData({ fields: outputAlbums, object: removePrefixAlbum });
}


const getAllAlbumsOfUser = async (userId, page = 1, limit = 10) => {
    // Validate pagination parameters
    const currentPage = Math.max(1, parseInt(page) || 1);
    const itemsPerPage = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Max 100 items per page
    const skip = (currentPage - 1) * itemsPerPage;

    // Get total count first
    const totalItems = await albumModel.countDocuments({ 
        alb_userId: convertToObjectIdMongoose(userId) 
    });
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const remainingPages = Math.max(0, totalPages - currentPage);

    // Get paginated albums
    const albums = await albumModel.aggregate([
        {
            $match: {
                alb_userId: convertToObjectIdMongoose(userId)
            }
        },
        {
            $lookup: {
                from: "Images",
                localField: "alb_cover_image",
                foreignField: "_id",
                as: "cover_image_data"
            }
        },
        {
            $unwind: {
                path: "$cover_image_data",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                cover_image: "$cover_image_data.img_secureUrl"
            }
        },
        {
            $sort: { createdAt: -1 } // Sort by newest first
        },
        {
            $skip: skip
        },
        {
            $limit: itemsPerPage
        },
        {
            $project: {
                _id: 0,
                id: "$alb_id",
                title: "$alb_title",
                description: "$alb_description",
                cover_image: 1,
                isPublic: "$alb_isPublic",
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    return {
        albums: albums,
        pagination: {
            currentPage: currentPage,
            itemsPerPage: itemsPerPage,
            totalItems: totalItems,
            totalPages: totalPages,
            remainingPages: remainingPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
            nextPage: currentPage < totalPages ? currentPage + 1 : null,
            previousPage: currentPage > 1 ? currentPage - 1 : null
        }
    };
}

const editAlbum = async (userId, albumId, payload) => {
    const { title, description, cover_image } = payload;

    const data = {
        alb_title: title,
        alb_description: description,
    };

    // Nếu có cover_image mới, tìm ảnh tương ứng
    if (cover_image) {
        const findImage = await ImageModel.findOne({
            img_id: cover_image,
            img_uploaderId: convertToObjectIdMongoose(userId),
        });

        if (findImage) {
            data.alb_cover_image = findImage._id;
        }
    }

    // Cập nhật album và populate ảnh bìa
    const updatedAlbum = await albumModel.findOneAndUpdate(
        { alb_id: albumId },
        data,
        { new: true }
    ).populate({
        path: 'alb_cover_image',
        select: 'img_secureUrl', // lấy mỗi link ảnh
    });

    // Chuyển sang object thuần
    const albumObj = updatedAlbum.toObject();

    // Gán cover_image là chuỗi URL
    albumObj.cover_image = albumObj.alb_cover_image?.img_secureUrl || null;

    // Xoá alb_cover_image
    delete albumObj.alb_cover_image;

    // Gỡ prefix alb_
    const cleanAlbum = removePrefixFromKeys(albumObj, 'alb_');

    // Trả về kết quả đúng format mong muốn
    return omitInfoData({
        fields: outputAlbums,
        object: cleanAlbum
    });
};


module.exports = {
    createNewAbums,
    getAllAlbumsOfUser,
    editAlbum,
    // getAllImagesByAlbumId
};