const { createNewAbums, editAlbum, getAllAlbumsOfUser } = require("../../service/albums.service");
const { SuccessResponse } = require("../../utils/handRespones/success.response");


const newAlbum = async (req, res) => {
    const payload = req.body;
    const userId = req.decoded.userId;
    const newAlbum = await createNewAbums(payload, userId);
    new SuccessResponse({
        message: 'Album created successfully',
        metadata: newAlbum
    }).send(res);


}
const editAlbumByUser = async (req, res) => {
    const { albumId } = req.params;
    const payload = req.body;
    const updatedAlbum = await editAlbum(req.decoded.userId, albumId, payload);
    new SuccessResponse({
        message: 'Album updated successfully',
        metadata: updatedAlbum
    }).send(res);
}
const getAllAlbumsByUser = async (req, res) => {
    const userId = req.decoded.userId;
    const { page, limit } = req.query; // Lấy pagination parameters
    const result = await getAllAlbumsOfUser(userId, page, limit);
    new SuccessResponse({
        message: 'All albums retrieved successfully',
        metadata: {
            albums: result.albums,
            pagination: result.pagination
        }
    }).send(res);
}


module.exports = {
    getAllAlbumsByUser,
    newAlbum,
    editAlbumByUser
};