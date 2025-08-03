const { LoginAccount, RegisterAccount, RefreshToken, LogoutAccount } = require('../../controller/Account/account');
const { inputLogin, inputRegister } = require('../../dto/account');
const { authenticate } = require('../../middleware/token');
const { asyncHandler } = require('../../utils/async/asyncHandler');
const { validateSchema } = require('../../utils/validate/joi');


const router= require('express').Router();





router.post('/register', validateSchema(inputRegister), asyncHandler(RegisterAccount));

router.post('/login',validateSchema(inputLogin), asyncHandler(LoginAccount));
router.use(authenticate);
router.patch('/refresh-token', asyncHandler(RefreshToken));

router.delete('/logout', asyncHandler(LogoutAccount));


module.exports = router;
