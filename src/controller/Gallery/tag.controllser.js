const { newTag, deleteTagById, getAllTagsByUserId } = require("../../service/tags.service");
const { SuccessResponse } = require("../../utils/handRespones/success.response");



const createTag = async (req, res) => {
    const tag = await newTag(req.decoded.userId, req.body);
    new SuccessResponse({
        message: 'Tag created successfully',
        metadata: tag
    }).send(res);
}


const deleteTag = async (req, res) => {
    const { tagId } = req.params;
   ;
    new SuccessResponse({
        message: 'Tag deleted successfully',
        metadata: await deleteTagById(req.decoded.userId, tagId)
    }).send(res);
}
const getAllTags = async (req, res) => {
    const tags = await getAllTagsByUserId(req.decoded.userId);
    new SuccessResponse({
        message: 'All tags retrieved successfully',
        metadata: tags
    }).send(res);
}

module.exports = {
    createTag,
    deleteTag,
    getAllTags
};