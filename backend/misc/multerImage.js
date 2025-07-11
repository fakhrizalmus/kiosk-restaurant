const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/file/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileType = file.mimetype.split('/')[1]
    cb(null, file.fieldname + '-' + uniqueSuffix + `.${fileType}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG files are allowed'), false);
  }
};

const uploadImage = multer({ storage, fileFilter, limits: {
    fileSize: 10 * 1024 * 1024 //10 mb
} })

module.exports = uploadImage