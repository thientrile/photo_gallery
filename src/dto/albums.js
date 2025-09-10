const Joi = require("joi")


const outputAlbums = ['_id', '__v', "createdAt", "updatedAt", '_id']


const inputCreateAlbums = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    cover_image: Joi.string().pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/).required()
});

const inputEditAlbums = Joi.object({
    title: Joi.string().min(2).max(100).optional().required(),
    description: Joi.string().max(500).optional(),
    cover_image: Joi.string().pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/).optional()
});


module.exports = {
    outputAlbums,
    inputCreateAlbums,
    inputEditAlbums
};