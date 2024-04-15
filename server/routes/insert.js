const router = require('express').Router()
const insert = require('../data/insertData')

router.post('/create', insert.createProduct)
router.post('/category', insert.createProductCategory)

module.exports = router
