

const bcrypt = require('bcrypt');
const { BadRequestError } = require('../utils/handRespones/error.response');
const userModel = require('../model/user.model');
const { addPrefixToKeys, removePrefixFromKeys, omitInfoData } = require('../utils');
const { createKey, addJIT } = require('./keyToken.services');
const { createToken } = require('../utils/jsonwebtoken/utils');
const { outputUser } = require('../dto/account');
const { userFindByusername } = require('../repository/user.repo');
const { tk_deleteOne } = require('../repository/keyToken.repo');
const registerAccount = async (payload) => {
    const { name, email, password } = payload;
    // check if the user already exists
    const existingUser = await userModel.findOne({ usr_email: email });
    if (existingUser) {
        throw new BadRequestError('User already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const data = {}
    data.salt = passwordHash;
    data.name = name;
    data.email = email;

    const newUser = await userModel.create(addPrefixToKeys(data, 'usr_'));
    if (!newUser) {
        throw new BadRequestError('Failed to create user');
    }
    //

    // create token
    const tokens = await createKey(newUser._id);
    const user = removePrefixFromKeys(newUser.toObject(), 'usr_')

    return {
        user: omitInfoData({
            fields: outputUser, object: user
        }),
        tokens
    };

    // Save the user data to the database
};

const loginAccount = async (payload) => {
    const { username, password } = payload;
    // check if the user exists
    const findUser = await userFindByusername(username);
    if (!findUser) {
        throw new BadRequestError('User not found');
    }
    const comparePassword = await bcrypt.compare(password, findUser.usr_salt);
    if (!comparePassword) {
        throw new BadRequestError('Incorrect password');
    }
    // create token
    // create token
    const tokens = await createKey(findUser._id);
    const user = removePrefixFromKeys(findUser, 'usr_');
    return {
        user: omitInfoData({
            fields: outputUser, object: user
        }),
        tokens
    };

}

const logoutAccount = async (clientId) => {
    // delete key
    await tk_deleteOne({ tk_clientId: clientId });

    return true;
}


const refreshToken = async (decoded) => {
    const payload = {
        userId: decoded.userId,
        clientId: decoded.clientId,

    };
    const [tokens] = await Promise.all([
        createToken(payload),
        addJIT(payload.clientId, decoded.jit),
    ])
    if (!tokens) {
        throw new BadRequestError('Failed to refresh token');
    }
    return {
        tokens
    }
}

module.exports = {
    registerAccount,
    loginAccount,
    logoutAccount,
    refreshToken
};