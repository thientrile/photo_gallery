const { registerAccount, loginAccount, refreshToken, logoutAccount } = require("../../service/access.service");
const { SuccessResponse } = require("../../utils/handRespones/success.response");


const RegisterAccount = async (req, res) => {
    new SuccessResponse({
        message: 'Register Account',
        metadata: await registerAccount(req.body)
    }).send(res);
}
const LoginAccount = async (req, res) => {
    new SuccessResponse({
        message: 'Login Account',
        metadata: await loginAccount(req.body)
    }).send(res);
}

const RefreshToken = async (req, res) => {
    new SuccessResponse({
        message: 'Refresh Token',
        metadata: await refreshToken(req.decoded)
    }).send(res);
}
const LogoutAccount = async (req, res) => {
    new SuccessResponse({
        message: 'Logout Account',
        metadata: await logoutAccount(req.decoded.clientId)
    }).send(res);
}
module.exports = {
    RegisterAccount,
    LoginAccount,
    RefreshToken,
    LogoutAccount
};