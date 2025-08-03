const albumModel = require("../model/album.model")
const { convertToObjectIdMongoose } = require("../utils")



const mongoose = require("mongoose");

const getAlbumByUserId = async (userId) => {


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

    return albums;
};

const getOneAlbumByUserIdAndAlbId = async (userId, albumId) => {
    try {
        const result = await albumModel.aggregate([
            {
                $match: {
                    alb_userId: convertToObjectIdMongoose(userId),
                    alb_id: Number(albumId), // đảm bảo là số
                }
            },
            {
                $lookup: {
                    from: 'Images', // ⚠️ nhớ viết đúng tên collection
                    localField: 'alb_cover_image',
                    foreignField: '_id',
                    as: 'cover_image_data'
                }
            },
            {
                $unwind: {
                    path: '$cover_image_data',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    cover_image: '$cover_image_data.img_secureUrl'
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$alb_id',
                    title: '$alb_title',
                    description: '$alb_description',
                    cover_image: 1,
                }
            }
        ]);

        return result[0] || null; // chỉ lấy 1 album
    } catch (error) {
        console.error('❌ Error in getOneAlbumByUserIdAndAlbId:', error);
        throw error;
    }
};


module.exports = {
    getAlbumByUserId,
    getOneAlbumByUserIdAndAlbId
}