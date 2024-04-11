const multer = require('multer')

const storage = multer.diskStorage({
  params: {
    folder: 'ecommerce',
  },
})

const upload = multer({ storage: storage })

module.exports = upload
