

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

// Optional authentication - không bắt buộc phải có token
const optionalAuthenticate = async (req, res, next) => {
    try {
        const token = req.headers[header.REFRESHTOKEN] || req.headers[header.AUTHORIZATION];

        if (!token) {
            // Không có token thì tiếp tục, không set req.decoded
            return next();
        }

        const decoded = verifyToken(token.replace('Bearer ', ''));
        
        if (req.headers[header.REFRESHTOKEN] && !decoded.isRefreshToken) {
            // Token không hợp lệ nhưng vẫn cho phép tiếp tục
            return next();
        }

        // check if the token is expired
        const keyToken = await tk_checkKeyTokenVerify(decoded.clientId);
        if (!keyToken) {
            // Token không hợp lệ nhưng vẫn cho phép tiếp tục
            return next();
        }

        // check if the userId in the token is the same as the userId in the keyToken
        if(keyToken.tk_jit.includes(decoded.jit)) {
            // Token expired nhưng vẫn cho phép tiếp tục
            return next();
        }

        const userId = keyToken.tk_userId.toString();
        if (decoded.userId !== userId) {
            // Token không hợp lệ nhưng vẫn cho phép tiếp tục
            return next();
        }

        // Token hợp lệ, set req.decoded
        req.decoded = decoded;
        next();
    } catch (err) {
        // Có lỗi nhưng vẫn cho phép tiếp tục mà không set req.decoded
        next();
    }
}

module.exports = {
    authenticate,
    optionalAuthenticate
};