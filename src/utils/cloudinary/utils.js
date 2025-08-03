
const cloudinary = require('./cloudinary.js');
const { Readable } = require('stream');

const streamUpload = (buffer, publicId, folder,tags=[]) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder,
        resource_type: 'auto',
        tags,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

module.exports = { streamUpload };
