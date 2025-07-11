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

const uploadImage = multer({ storage })

module.exports = uploadImage