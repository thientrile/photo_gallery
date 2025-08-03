const tagModel = require("../model/tag.model");
const { convertToObjectIdMongoose, addPrefixToKeys, removePrefixFromKeys, omitInfoData } = require("../utils");
const { BadRequestError } = require("../utils/handRespones/error.response");


const newTag = async (userId, payload) => {
    const { name } = payload;
    console.log("🚀 ~ newTag ~ payload:", payload)
    const tagData = {
        tag_name: name,
        tag_createdBy: convertToObjectIdMongoose(userId)
    };

    const newTag = await tagModel.create(tagData);
    if (!newTag) {
        throw new BadRequestError('Failed to create tag');
    }
    return omitInfoData({
        fields: ["_id","createdBy"],
        object: removePrefixFromKeys(newTag.toObject(), 'tag_')
    });
};


const deleteTagById = async (userId, tagId) => {
    const tag = await tagModel.findOneAndDelete({
        tag_id: tagId,
        tag_createdBy: convertToObjectIdMongoose(userId)
    });

    if (!tag) {
        throw new BadRequestError('Tag not found or you do not have permission to delete it');
    }

    return true
}
const getAllTagsByUserId = async (userId) => {
    const tags = await tagModel.find({ tag_createdBy: convertToObjectIdMongoose(userId) }).lean();
    return tags.map((tag) =>omitInfoData({
        fields: ["_id","createdBy"],
        object: removePrefixFromKeys(tag, 'tag_')
    }) );
}


module.exports = {
    newTag,
    deleteTagById,
    getAllTagsByUserId
};
