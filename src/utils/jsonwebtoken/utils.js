const { randomUUID } = require("crypto");
const config = require("../../../config.js");
const jwt = require("jsonwebtoken");
const createToken = (payload) => {

    const jit = randomUUID();
    payload.jit = jit;
    const accessToken = jwt.sign(payload, config.jwt.secret, {
        expiresIn: "7d",
    });
    payload.isRefreshToken = true;
    const refreshToken = jwt.sign(payload, config.jwt.secret, {
        expiresIn: "30d",
    });
    return { accessToken, refreshToken };
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = {
    createToken,
    verifyToken
};