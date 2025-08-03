
const express = require('express');
const { asyncHandler } = require('../../utils/async/asyncHandler');
const { authenticate } = require('../../middleware/token');
const { createTag, deleteTag, getAllTags } = require('../../controller/Gallery/tag.controllser');
const r= express.Router();

r.use(authenticate);
r.post('/',asyncHandler(createTag))
r.delete('/:tagId', asyncHandler(deleteTag));
r.get('/',asyncHandler(getAllTags))



module.exports = r;