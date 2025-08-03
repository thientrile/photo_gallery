

const { tk_checkKeyTokenVerify } = require('../repository/keyToken.repo');
const header = require('../utils/context/header');
const { ForbiddenError } = require('../utils/handRespones/error.response');
const { verifyToken } = require('../utils/jsonwebtoken/utils');

const authenticate =async (req, res, next) => {
    try {
        const token = req.headers[header.REFRESHTOKEN] || req.headers[header.AUTHORIZATION];

        if (!token) {
            next(new ForbiddenError('Token invalid'));
        }
        const decoded = verifyToken(token.replace('Bearer ', ''));
        
        if (req.headers[header.REFRESHTOKEN] && !decoded.isRefreshToken) {
            next(new ForbiddenError('Token invalid'));
        }
        // check if the token is expired
        const keyToken = await tk_checkKeyTokenVerify(decoded.clientId);
        if (!keyToken) {
            next(new ForbiddenError('Token invalid'));
        }
        // check if the userId in the token is the same as the userId in the keyToken
        if(keyToken.tk_jit.includes(decoded.jit) ) {
            next(new ForbiddenError('Token expired'));
        }
        const userId= keyToken.tk_userId.toString();
        if (decoded.userId !== userId) {
            next(new ForbiddenError('Token invalid'));
        }
        req.decoded = decoded;
        next();
    } catch (err) {
        next(err);
    }

}
module.exports = {
    authenticate
};