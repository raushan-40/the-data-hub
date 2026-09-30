const multer = require('multer');

// Memory storage allows direct streaming/upload to Cloudinary without writing to disk
const storage = multer.memoryStorage();

// File filter to restrict uploads to image MIME types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, png, webp, gif, etc.) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB maximum file size
  }
});

module.exports = upload;