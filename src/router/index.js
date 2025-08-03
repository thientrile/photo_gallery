


const router = require('express').Router();

router.use("/account", require('./account/account.router'));
router.use("/images", require('./gallery/image.router'));
router.use("/albums", require('./gallery/album.router'));
router.use("/tags", require('./gallery/tag.router'));
module.exports = router;