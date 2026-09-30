const express = require('express');
const { Readable } = require('stream');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

// POST /uploads/image - Upload a single image to Cloudinary
router.post('/image', (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    // Handle Multer-specific errors (e.g. file size exceeded or invalid MIME type)
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    try {
      // Upload buffer to Cloudinary using upload_stream
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'the-data-hub' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );

        Readable.from(req.file.buffer).pipe(stream);
      });

      const result = await uploadPromise;

      return res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: result.secure_url,
        public_id: result.public_id
      });
    } catch (uploadError) {
      return res.status(500).json({
        message: 'Failed to upload image to Cloudinary',
        error: uploadError.message
      });
    }
  });
});

module.exports = router;