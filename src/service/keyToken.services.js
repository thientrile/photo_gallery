const { createToken } = require("../utils/jsonwebtoken/utils");
const keyModel = require("../model/keyToken.model");

const createKey= async(userId)=>{
    const newKey = await keyModel.create({tk_userId: userId });
    if (!newKey) {
        throw new BadRequestError('Failed to create key');
    }
    const data={userId,clientId: newKey.tk_clientId};
    const tokens=  createToken(data);

    return tokens;
}
const addJIT= async (clientId, jit) => {
    const key = await keyModel.findOneAndUpdate(
        { tk_clientId: clientId },
        { $addToSet: { tk_jit: jit } },
        { new: true }
    );
    if (!key) {
        throw new NotFoundError('Key not found');
    }
    return key;
}
module.exports = {
    createKey,
    addJIT
};